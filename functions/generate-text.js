// functions/generate-text.js
const fetch = require('node-fetch');
const config = require('./config');
const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client with error handling
let supabase;
try {
  // Check if Supabase environment variables are set
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  // Initialize Supabase client with explicit error handling
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false // Since this is a serverless function
      }
    }
  );

  // Test the connection
  console.log('Testing Supabase connection...');
  supabase.from('projects').select('count').limit(1)
    .then(() => {
      console.log('Supabase connection successful');
    })
    .catch(error => {
      console.error('Supabase connection test failed:', error);
      throw error;
    });

} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabase = null;
}

// Add a helper function to check Supabase connection
const ensureSupabaseConnection = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  
  try {
    // Test the connection with a simple query
    await supabase.from('projects').select('count').limit(1);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    throw new Error('Failed to connect to Supabase. Please check your configuration.');
  }
};

// Helper function to truncate text to a maximum length
const truncateText = (text, maxLength = 1000) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to summarize text (for previous chapter content)
const summarizeText = (text) => {
  if (!text) return '';
  const maxLength = 500;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to fetch project context from Supabase
const fetchProjectContext = async (projectId, userId, selectedContext = null) => {
  try {
    // Ensure Supabase connection is working
    await ensureSupabaseConnection();
    
    console.log(`Fetching context for project_id: ${projectId}, user_id: ${userId}`);
    console.log('Selected context:', selectedContext);
    
    let characters = [], locations = [], events = [];
    
    // If selectedContext is provided, fetch only selected items
    if (selectedContext) {
      // Fetch selected characters
      if (selectedContext.characters.length > 0) {
        const { data: selectedCharacters, error: charError } = await supabase
          .from('characters')
          .select('*')
          .eq('project_id', projectId)
          .in('id', selectedContext.characters.map(c => c.id));
        
        if (charError) {
          console.error('Characters query error:', charError);
        } else {
          characters = selectedCharacters || [];
        }
      }
      
      // Fetch selected locations
      if (selectedContext.locations.length > 0) {
        const { data: selectedLocations, error: locError } = await supabase
          .from('locations')
          .select('*')
          .eq('project_id', projectId)
          .in('id', selectedContext.locations.map(l => l.id));
        
        if (locError) {
          console.error('Locations query error:', locError);
        } else {
          locations = selectedLocations || [];
        }
      }
      
      // Fetch selected events
      if (selectedContext.events.length > 0) {
        const { data: selectedEvents, error: eventsError } = await supabase
          .from('timeline_events')
          .select('*')
          .eq('project_id', projectId)
          .in('id', selectedContext.events.map(e => e.id));
        
        if (eventsError) {
          console.error('Events query error:', eventsError);
        } else {
          events = selectedEvents || [];
        }
      }
    } else {
      // If no selection provided, fetch all context items
      const { data: allCharacters, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('project_id', projectId);
      
      if (charError) {
        console.error('Characters query error:', charError);
      } else {
        characters = allCharacters || [];
      }
      
      const { data: allLocations, error: locError } = await supabase
        .from('locations')
        .select('*')
        .eq('project_id', projectId);
      
      if (locError) {
        console.error('Locations query error:', locError);
      } else {
        locations = allLocations || [];
      }
      
      const { data: allEvents, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('project_id', projectId);
      
      if (eventsError) {
        console.error('Events query error:', eventsError);
      } else {
        events = allEvents || [];
      }
    }
    
    // Try to fetch all timeline_event_characters links if we have events
    let eventCharacterLinks = [];
    if (events.length > 0) {
      try {
        const { data: links, error: linksError } = await supabase
          .from('timeline_event_characters')
          .select('*')
          .in('event_id', events.map(e => e.id));
        
        if (!linksError) {
          eventCharacterLinks = links || [];
          console.log(`Found ${eventCharacterLinks.length} timeline_event_characters links`);
        }
      } catch (e) {
        console.log('Error checking for timeline_event_characters:', e.message);
      }
    }
    
    // Format the context string with more detailed information
    let contextString = 'Project Context:\n\n';
    
    // Add characters section with detailed information
    contextString += 'Characters:\n';
    if (characters.length > 0) {
      characters.forEach(char => {
        contextString += `Character: ${char.name}\n`;
        contextString += `  Role: ${char.role || 'Unspecified'}\n`;
        if (char.traits) contextString += `  Traits: ${truncateText(char.traits, 200)}\n`;
        if (char.backstory) contextString += `  Backstory: ${truncateText(char.backstory, 300)}\n`;
        
        // Add event connections if we have them
        if (eventCharacterLinks.length > 0) {
          const characterEvents = events.filter(event => 
            eventCharacterLinks.some(link => 
              link.character_id === char.id && link.event_id === event.id
            )
          );
          
          if (characterEvents.length > 0) {
            contextString += `  Appears in events:\n`;
            characterEvents.forEach(event => {
              contextString += `    - ${event.name} (${event.date_time || 'unknown time'})\n`;
            });
          }
        }
        
        contextString += '\n';
      });
    } else {
      contextString += 'No characters selected.\n\n';
    }
    
    // Add locations section with detailed information
    contextString += 'Locations:\n';
    if (locations.length > 0) {
      locations.forEach(loc => {
        contextString += `Location: ${loc.name}\n`;
        contextString += `  Type: ${loc.type || 'Unspecified'}\n`;
        if (loc.description) contextString += `  Description: ${truncateText(loc.description, 200)}\n`;
        if (loc.key_features) contextString += `  Key Features: ${truncateText(loc.key_features, 200)}\n`;
        
        // Add events that occur at this location
        const locationEvents = events.filter(event => event.location_id === loc.id);
        if (locationEvents.length > 0) {
          contextString += `  Events at this location:\n`;
          locationEvents.forEach(event => {
            contextString += `    - ${event.name} (${event.date_time || 'unknown time'})\n`;
          });
        }
        
        contextString += '\n';
      });
    } else {
      contextString += 'No locations selected.\n\n';
    }
    
    // Add timeline events section
    contextString += 'Timeline Events:\n';
    if (events.length > 0) {
      // Sort events by date_time if available
      const sortedEvents = [...events].sort((a, b) => {
        if (!a.date_time) return 1;
        if (!b.date_time) return -1;
        return new Date(a.date_time) - new Date(b.date_time);
      });
      
      sortedEvents.forEach(event => {
        contextString += `Event: ${event.name}\n`;
        if (event.date_time) contextString += `  Time: ${event.date_time}\n`;
        if (event.description) contextString += `  Description: ${truncateText(event.description, 200)}\n`;
        
        // Add location if available
        const location = locations.find(loc => loc.id === event.location_id);
        if (location) contextString += `  Location: ${location.name}\n`;
        
        // Add involved characters
        const involvedCharacters = characters.filter(char =>
          eventCharacterLinks.some(link =>
            link.event_id === event.id && link.character_id === char.id
          )
        );
        
        if (involvedCharacters.length > 0) {
          contextString += `  Characters involved: ${involvedCharacters.map(c => c.name).join(', ')}\n`;
        }
        
        contextString += '\n';
      });
    } else {
      contextString += 'No timeline events selected.\n';
    }
    
    return contextString;
  } catch (error) {
    console.error('Error in fetchProjectContext:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return 'Error fetching project context: ' + error.message;
  }
};

// Helper function to fetch previous chapters with focus on continuity
const fetchPreviousChapters = async (projectId, userId, prompt = '') => {
  try {
    // Ensure Supabase connection is working
    await ensureSupabaseConnection();
    
    console.log(`Fetching previous chapters for project_id: ${projectId}`);
    
    // Extract chapter number from prompt if it exists
    const chapterMatch = prompt.match(/chapter\s+(\d+)/i);
    const targetChapter = chapterMatch ? parseInt(chapterMatch[1]) : null;
    console.log('Target chapter from prompt:', targetChapter);
    
    // Direct query using known table name
    console.log('Querying "chapters" table with project_id:', projectId);
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });
    
    if (chaptersError) {
      console.error('Chapters query error:', chaptersError);
      return 'Error fetching chapters: ' + chaptersError.message;
    }
    
    console.log(`Retrieved ${chapters?.length || 0} chapters from database`);
    if (chapters?.length > 0) {
      console.log('Sample chapter data:', chapters[0]);
    }
    
    if (chapters && chapters.length > 0) {
      console.log(`Found ${chapters.length} chapters`);
      let chaptersText = 'PREVIOUS CHAPTERS:\n\n';
      
      if (targetChapter) {
        // If continuing a specific chapter, focus on that chapter and its immediate predecessor
        const targetIndex = chapters.findIndex(chapter => 
          chapter.order_index === targetChapter - 1 || 
          (chapter.chapter_number && chapter.chapter_number === targetChapter)
        );
        
        if (targetIndex !== -1) {
          console.log(`Found target chapter at index ${targetIndex}`);
          
          // Add the target chapter
          const targetChapterData = chapters[targetIndex];
          chaptersText += `CURRENT CHAPTER TO CONTINUE FROM (Chapter ${targetChapter}):\n`;
          chaptersText += `Title: ${targetChapterData.title || 'Untitled'}\n`;
          chaptersText += `${targetChapterData.content}\n\n`;
          
          // Add the previous chapter for context if it exists
          if (targetIndex > 0) {
            const previousChapter = chapters[targetIndex - 1];
            const prevChapterNum = previousChapter.chapter_number || targetChapter - 1;
            chaptersText += `PREVIOUS CHAPTER (Chapter ${prevChapterNum}):\n`;
            chaptersText += `Title: ${previousChapter.title || 'Untitled'}\n`;
            chaptersText += `${summarizeText(previousChapter.content)}\n\n`;
          }
          
          // Add a brief summary of earlier chapters
          if (targetIndex > 1) {
            chaptersText += 'EARLIER CHAPTERS SUMMARY:\n';
            chapters.slice(0, targetIndex - 1).forEach((chapter, index) => {
              const chapterNum = chapter.chapter_number || index + 1;
              chaptersText += `Chapter ${chapterNum}: ${chapter.title || 'Untitled'}\n`;
              chaptersText += `${summarizeText(chapter.content, 200)}\n\n`;
            });
          }
        } else {
          console.log(`Target chapter ${targetChapter} not found in retrieved chapters`);
          chaptersText += `Warning: Chapter ${targetChapter} not found. Here are all available chapters:\n\n`;
          chapters.forEach((chapter, index) => {
            const chapterNum = chapter.chapter_number || chapter.order_index || (index + 1);
            chaptersText += `Chapter ${chapterNum}: ${chapter.title || 'Untitled'}\n`;
            chaptersText += `${summarizeText(chapter.content)}\n\n`;
          });
        }
      } else {
        // If not continuing a specific chapter, include all chapters with most recent in full
        console.log('No specific chapter targeted, including all chapters');
        chapters.forEach((chapter, index) => {
          const chapterNum = chapter.chapter_number || chapter.order_index || (index + 1);
          chaptersText += `Chapter ${chapterNum}: ${chapter.title || 'Untitled'}\n`;
          // Show full content for the most recent chapter, summaries for others
          if (index === chapters.length - 1) {
            chaptersText += `${chapter.content}\n\n`;
          } else {
            chaptersText += `${summarizeText(chapter.content)}\n\n`;
          }
        });
      }
      
      return chaptersText;
    }
    
    console.log('No previous chapters found');
    return 'No previous chapters found.';
  } catch (error) {
    console.error('Error fetching previous chapters:', error);
    return 'Error fetching previous chapters: ' + error.message;
  }
};

// Helper function to validate API keys
const validateApiKeys = (modelName) => {
    const isDeepSeekModel = modelName.includes('deepseek');
    const isQwen3Model = modelName.includes('qwen3');
    
    if (isDeepSeekModel && (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === '')) {
        throw new Error('DEEPSEEK_API_KEY is not configured. Please set this environment variable.');
    }
    
    if (isQwen3Model && (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === '')) {
        throw new Error('OPENROUTER_API_KEY is not configured. Please set this environment variable.');
    }
};

// Helper function to get the OpenRouter model name
const getOpenRouterModelName = (modelName) => {
    const modelMap = {
        // Premium Models via OpenRouter
        'claude-opus': 'anthropic/claude-3-opus',
        'claude-sonnet': 'anthropic/claude-3-sonnet',
        // Free Models via OpenRouter
        'qwen3-235b': 'qwen/qwen3-235b-a22b'
    };
    return modelMap[modelName] || modelName;
};

// Helper function to convert words to tokens (approximate)
const wordsToTokens = (wordCount) => {
    // Optimized token calculation - 1 word ≈ 1.3 tokens on average
    // Use a more accurate conversion with reasonable buffer
    const tokensEstimate = Math.ceil(wordCount * 1.3);
    
    // Add buffer for system message and context (200-400 tokens typically)
    const bufferTokens = Math.min(400, Math.ceil(wordCount * 0.1));
    
    return tokensEstimate + bufferTokens;
};

// Helper function to ensure text ends with a complete sentence
const ensureCompleteSentence = (text) => {
    if (!text) return text;
    
    // Find the last occurrence of common sentence endings
    const endings = ['. ', '! ', '? ', '."', '!"', '?"', '.\n', '!\n', '?\n'];
    let lastEndIndex = -1;
    
    endings.forEach(ending => {
        const index = text.lastIndexOf(ending);
        if (index > lastEndIndex) {
            lastEndIndex = index + ending.length;
        }
    });
    
    // If we found a sentence ending, trim to that point
    if (lastEndIndex > -1) {
        return text.substring(0, lastEndIndex).trim();
    }
    
    // If no sentence ending found, return the original text
    return text.trim();
};

// Helper function to create a timeout promise
const timeoutPromise = (ms, message) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error(message || 'Request timed out')), ms)
);

// Helper function to calculate dynamic timeout based on tokens and mode
const calculateTimeout = (maxTokens, mode, isDeepSeekModel) => {
    // Netlify functions now have 120 seconds timeout configured in netlify.toml
    const BASE_TIMEOUT = mode === 'chat' ? 15000 : 60000;   // 60 seconds base for generate mode
    const MAX_TIMEOUT = 115000;   // 115 seconds maximum (leave 5s buffer for processing)
    const MIN_TIMEOUT = mode === 'chat' ? 8000 : 20000;    // Minimum timeout
    const MS_PER_TOKEN = mode === 'chat' ? 6 : 10;         // More aggressive per-token time

    // Calculate timeout based on estimated words for better scaling
    const estimatedWords = maxTokens / 1.3; // More accurate conversion back to words
    
    // For very long requests, use maximum timeout
    if (estimatedWords > 1500) {
        return MAX_TIMEOUT; // 115 seconds for 1500+ word requests
    }
    
    if (isDeepSeekModel) {
        // DeepSeek is generally faster, so use more aggressive scaling
        const scaledTimeout = BASE_TIMEOUT + (maxTokens * (MS_PER_TOKEN * 0.7));
        return Math.min(MAX_TIMEOUT, Math.max(MIN_TIMEOUT, scaledTimeout));
    } else {
        // OpenRouter models - use longer timeouts for reliability
        const scaledTimeout = BASE_TIMEOUT + (maxTokens * MS_PER_TOKEN);
        return Math.min(MAX_TIMEOUT, Math.max(MIN_TIMEOUT, scaledTimeout));
    }
};

// Helper function to fetch with timeout and retry mechanism
const fetchWithTimeout = async (url, options, timeout) => {
    const MAX_RETRIES = 2;
    let lastError = null;
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            // If this is a retry, log it and add a small delay to avoid rate limiting
            if (attempt > 0) {
                console.log(`Retry attempt ${attempt}/${MAX_RETRIES} for API request`);
                // Add a small delay before retrying (increasing with each attempt)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
            
            const response = await Promise.race([
                fetch(url, { ...options, signal: controller.signal }),
                timeoutPromise(timeout, `Request timed out after ${timeout}ms`)
            ]);
            
            clearTimeout(timeoutId);
            
            // If the response is not ok but it's a 429 (rate limit) or a 5xx error,
            // these are retryable errors
            if (!response.ok && (response.status === 429 || response.status >= 500)) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            
            return response;
        } catch (error) {
            lastError = error;
            const isRetryableError = 
                error.name === 'AbortError' || 
                error.message.includes('timed out') ||
                error.message.includes('status 429') ||
                error.message.includes('status 5');
                
            // If this is the last attempt or the error is not retryable, throw it
            if (attempt === MAX_RETRIES || !isRetryableError) {
                // Add context to the error message
                if (error.name === 'AbortError' || error.message.includes('timed out')) {
                    throw new Error(`Request to ${url.split('?')[0]} timed out after ${timeout}ms. Try reducing the length parameter or simplifying the prompt.`);
                }
                throw error;
            }
            
            // Otherwise, continue to the next retry attempt
            console.warn(`Request failed (${error.message}). Retrying...`);
        }
    }
};

// Create system message based on desired length, tone, and context data
const createSystemMessage = (mode, userName, desiredWords, tone, contextString, previousChapters, isDeepSeekModel = false) => {
    // Simplified system messages for better performance
    if (mode === 'chat') {
        return `You are an AI writing assistant helping ${userName} brainstorm and plan their creative writing project.

Focus on DISCUSSION and IDEAS rather than writing full content. Ask questions, suggest plot points, and help develop characters and settings.

${contextString ? `Context: ${contextString.substring(0, 1500)}` : ''}
${previousChapters ? `Previous: ${previousChapters.substring(0, 1000)}` : ''}

Keep responses under ${Math.min(desiredWords, 300)} words${tone ? ` in a ${tone} tone` : ''}.`;
    } else {
        // Optimized system message for generate mode
        const contextLength = desiredWords > 2000 ? 1500 : 1000; // More context for longer requests
        const previousLength = desiredWords > 2000 ? 2000 : 1500; // More previous content for longer requests
        
        return `You are an AI writing assistant. Write exactly ${desiredWords} words of engaging story content${tone ? ` in a ${tone} tone` : ''}.

TARGET: ${desiredWords} words (range: ${Math.floor(desiredWords * 0.9)}-${Math.ceil(desiredWords * 1.1)} words).

${contextString ? `Context: ${contextString.substring(0, contextLength)}` : ''}
${previousChapters ? `Continue from: ${previousChapters.substring(0, previousLength)}` : ''}

Write compelling narrative with dialogue, action, and description. Maintain consistent pacing throughout.`;
    }
};

// Export using the proper format for Netlify Functions
exports.handler = async (event) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        // Basic validation
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({
                    error: 'Method not allowed. Please use POST.',
                    success: false
                })
            };
        }

        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing request body',
                    success: false
                })
            };
        }

        // Parse request
        let parsedBody;
        try {
            parsedBody = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid JSON in request body',
                    success: false
                })
            };
        }

        const { 
            prompt = '', 
            context = [], 
            mode = 'generate', // Default to generate mode
            tone = '', 
            length = '500',
            user_id = '',
            project_id = '',
            stream = false  // Add streaming support
        } = parsedBody;

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Prompt is required',
                    success: false
                })
            };
        }
        
        // Validate user_id and project_id
        if (!user_id || !project_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'user_id and project_id are required',
                    success: false
                })
            };
        }

        const modelName = event.queryStringParameters?.model || config.DEFAULT_MODEL;
        
        // Validate API keys before making request
        try {
            validateApiKeys(modelName);
        } catch (error) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    error: error.message,
                    success: false
                })
            };
        }
        
        // Fetch user data, project context, and previous chapters
        let userName = 'User'; // Default value
        let contextString = '';
        let previousChapters = '';
        
        try {
            // Get authenticated user data if Supabase is available
            if (supabase) {
                // Get user from auth
                const { data: authData, error: authError } = await supabase.auth.getUser();
                
                if (!authError && authData && authData.user) {
                    // Try to get user's name from auth.users table
                    const { data: userData, error: userError } = await supabase
                        .from('profiles')  // Assuming a profiles table exists with user names
                        .select('name')
                        .eq('id', authData.user.id)
                        .single();
                    
                    if (!userError && userData && userData.name) {
                        userName = userData.name;
                    } else {
                        console.log('User profile not found, using email or default name');
                        // Fallback to email address if available
                        userName = authData.user.email?.split('@')[0] || 'User';
                    }
                } else {
                    console.log('Auth user not found, using default name');
                }
                
                // Fetch project context
                contextString = await fetchProjectContext(project_id, user_id, context);
                
                // Fetch all previous chapters
                previousChapters = await fetchPreviousChapters(project_id, user_id, prompt);
                
                // Log the context being fed to the AI
                console.log('========== CONTEXT BEING FED TO AI ==========');
                console.log('Mode:', mode);
                console.log('Context String:', contextString);
                console.log('----------------------------------------');
                console.log('Previous Chapters:', previousChapters);
                console.log('==========================================');
                
                console.log('Fetched context data successfully');
            } else {
                console.warn('Supabase client not available, skipping context fetching');
            }
        } catch (contextError) {
            console.error('Error fetching context data:', contextError);
            // Don't fail the entire request, just log the error and proceed with defaults
        }

        const isDeepSeekModel = modelName.includes('deepseek');
        const isQwen3Model = modelName.includes('qwen3');

        // Convert desired word length to tokens and ensure minimum/maximum bounds based on mode
        const maxDesiredWords = mode === 'chat' ? 800 : 5000; // Increased to 5000 words for generate mode
        const minDesiredWords = mode === 'chat' ? 50 : 100;   // Different minimums for each mode
        
        const desiredWords = Math.min(Math.max(parseInt(length) || (mode === 'chat' ? 200 : 500), minDesiredWords), maxDesiredWords);
        const maxTokens = wordsToTokens(desiredWords);
        const timeout = calculateTimeout(maxTokens, mode, isDeepSeekModel);
        
        // Log the calculated values for debugging
        console.log(`Request details: words=${desiredWords}, tokens=${maxTokens}, timeout=${timeout}ms, model=${modelName}`);
        
        // Move the debugInfo creation here, after all variables are defined
        const debugInfo = {
            contextString,
            previousChapters,
            modelName,
            mode,
            requestedWords: desiredWords
            // Don't include actualWords and tokensUsed yet - they'll be added after generation
        };

        // Create system message based on desired length, tone, and context data
        const systemMessage = createSystemMessage(mode, userName, desiredWords, tone, contextString, previousChapters, isDeepSeekModel);

        // Adjust parameters based on mode
        const temperature = mode === 'chat' ? 0.9 : 0.8; // Higher temperature for chat mode to encourage more varied responses
        const presencePenalty = mode === 'chat' ? 0.8 : 0.5; // Higher presence penalty for chat to reduce repetition
        const frequencyPenalty = mode === 'chat' ? 0.7 : 0.5; // Higher frequency penalty for chat to reduce repetition

        // For very long requests, cap max_tokens to prevent API timeouts
        const effectiveMaxTokens = desiredWords > 3000 ? Math.min(maxTokens, 4000) : maxTokens;
        
        // Create request body with optimized settings for longer content
        const requestBody = isDeepSeekModel ? {
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: Math.min(temperature, 0.7), // Lower temperature for more focused output
            top_p: 0.9, // Slightly lower for better coherence
            max_tokens: effectiveMaxTokens,
            stream: false, // Disable streaming for better reliability
            presence_penalty: presencePenalty,
            frequency_penalty: frequencyPenalty,
            stop: null  // Remove stop sequences that might truncate content
        } : {
            model: getOpenRouterModelName(modelName),
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: Math.min(temperature, 0.7), // Lower temperature for more focused output
            top_p: 0.9, // Slightly lower for better coherence
            max_tokens: effectiveMaxTokens,
            stop: null  // Remove stop sequences that might truncate content
        };

        // Make API request
        const apiUrl = isDeepSeekModel 
            ? 'https://api.deepseek.com/v1/chat/completions'
            : 'https://openrouter.ai/api/v1/chat/completions';

        // Prepare headers based on the API being used
        const headers = {
            'Content-Type': 'application/json'
        };

        if (isDeepSeekModel) {
            headers['Authorization'] = `Bearer ${process.env.DEEPSEEK_API_KEY}`;
        } else {
            headers['Authorization'] = `Bearer ${process.env.OPENROUTER_API_KEY}`;
            // Required OpenRouter headers
            headers['HTTP-Referer'] = process.env.SITE_URL || 'https://github.com/themalagasywizard/aiwritingtool';
            headers['X-Title'] = 'AIStoryCraft';
        }

        let response;
        let finalRequestBody = requestBody;
        
        try {
            response = await fetchWithTimeout(
                apiUrl,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(finalRequestBody)
                },
                timeout
            );
        } catch (error) {
            // If the request fails and it's a long request, try with reduced tokens
            if (desiredWords > 2000 && (error.message.includes('timed out') || error.message.includes('499'))) {
                console.log(`Long request failed, retrying with reduced tokens: ${desiredWords} words`);
                const reducedTokens = Math.floor(effectiveMaxTokens * 0.7); // Reduce by 30%
                
                finalRequestBody = isDeepSeekModel ? {
                    ...requestBody,
                    max_tokens: reducedTokens
                } : {
                    ...requestBody,
                    max_tokens: reducedTokens
                };
                
                // Try again with reduced tokens and longer timeout
                response = await fetchWithTimeout(
                    apiUrl,
                    {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(finalRequestBody)
                    },
                    Math.min(timeout + 30000, 115000) // Add 30 seconds but cap at 115s
                );
            } else {
                throw error; // Re-throw if not a long request or different error
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('API Response:', result); // Debug log

        // Extract text and usage info
        let generatedText = '';
        let usage = null;

        if (isDeepSeekModel && result.choices?.[0]?.message?.content) {
            generatedText = result.choices[0].message.content;
            usage = result.usage;
        } else if (!isDeepSeekModel) { // OpenRouter response handling
            if (!result.choices?.[0]?.message?.content) {
                console.error('Unexpected OpenRouter response format:', result);
                throw new Error('Invalid response format from OpenRouter API');
            }
            generatedText = result.choices[0].message.content;
            usage = {
                prompt_tokens: result.usage?.prompt_tokens || 0,
                completion_tokens: result.usage?.completion_tokens || 0,
                total_tokens: result.usage?.total_tokens || 0
            };
        } else {
            console.error('Unexpected API response:', result);
            throw new Error('Invalid response format from API');
        }

        // Ensure we have generated text
        if (!generatedText) {
            console.error('No text generated from API response:', result);
            throw new Error('No text was generated from the API response');
        }

        // Ensure the text ends with a complete sentence
        generatedText = ensureCompleteSentence(generatedText);

        // Count actual words
        const actualWords = generatedText.trim().split(/\s+/).length;

        // Add actualWords and tokensUsed to debugInfo
        debugInfo.actualWords = actualWords;
        debugInfo.tokensUsed = usage?.total_tokens || null;

        // Return success response with debug info
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                text: generatedText,
                model: modelName,
                userName: userName,
                mode: mode,
                contextProvided: !!contextString,
                previousChaptersProvided: !!previousChapters,
                usage: usage,
                requestedWords: desiredWords,
                actualWords: actualWords,
                actualTokens: usage?.total_tokens || null,
                debug: {
                    contextString,
                    previousChapters,
                    modelName,
                    mode,
                    requestedWords: desiredWords,
                    actualWords: actualWords,
                    tokensUsed: usage?.total_tokens || null,
                    rawResponse: process.env.NODE_ENV === 'development' ? result : null
                }
            })
        };

    } catch (error) {
        console.error('Error in generate-text:', error);
        
        // Provide more helpful error messages based on error type
        let errorMessage = error.message;
        let statusCode = 500;
        
        if (error.message.includes('timed out') || error.name === 'AbortError') {
            statusCode = 408; // Request Timeout
            errorMessage = `Request timed out after ${timeout/1000} seconds. For requests over 2000 words, try: 1. Use DeepSeek model (faster) 2. Reduce complexity in your prompt 3. Try generating in 2000-word chunks 4. Wait a moment and retry`;
        } else if (error.message.includes('API key')) {
            statusCode = 401; // Unauthorized
            errorMessage = 'API key error: ' + error.message;
        } else if (error.message.includes('status 429')) {
            statusCode = 429; // Too Many Requests
            errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
        } else if (error.message.includes('status 5')) {
            statusCode = 503; // Service Unavailable
            errorMessage = 'The AI service is currently unavailable. Please try again later.';
        }

        return {
            statusCode,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                success: false,
                debug: {
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : null
                }
            })
        };
    }
}; 
