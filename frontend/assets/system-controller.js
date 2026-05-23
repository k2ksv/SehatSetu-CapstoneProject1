// Sehat Setu Autonomous System Controller
// Voice + Text | Multilingual | Intent Engine | UI Automation

// --- 1. Voice Recognition Setup (Web Speech API) ---
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Default, will auto-detect
}

function startVoiceInput() {
    if (!recognition) return;
    recognition.start();
}

if (recognition) {
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        window.sehatSetuController(transcript, true);
    };
}

// --- 2. Language Detection ---
function detectLanguage(text) {
    const hindiRegex = /[\u0900-\u097F]/;
    if (hindiRegex.test(text)) return 'hi';
    const hinglishWords = ['hai', 'ka', 'ke', 'mein', 'wala', 'dikhao', 'jaldi', 'sasta', 'hospital', 'doctor', 'bimari', 'insurance'];
    const lower = text.toLowerCase();
    if (hinglishWords.some(w => lower.includes(w))) return 'hinglish';
    return 'en';
}

// --- 3. Intent Extraction (Basic) ---
function extractIntent(text) {
    const lower = text.toLowerCase();
    if (/emergency|urgent|jaldi|accident/.test(lower)) return { intent: 'emergency' };
    if (/hospital|icu|sasta|cost|near|location|city|compare/.test(lower)) return { intent: 'hospital_search' };
    if (/doctor|specialist|mbbs|md|timing|availability/.test(lower)) return { intent: 'doctor_search' };
    if (/insurance|emi|installment|afford|cashless/.test(lower)) return { intent: 'insurance_query' };
    if (/back|home|open|page|dashboard/.test(lower)) return { intent: 'navigation' };
    return { intent: 'unknown' };
}

// --- 4. UI Action Dispatcher ---
function dispatchAction(intentObj, lang, text) {
    switch (intentObj.intent) {
        case 'emergency':
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'show_emergency', lang, text } }));
            break;
        case 'hospital_search':
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'go_to_page', page: 'hospitals', lang, text } }));
            break;
        case 'doctor_search':
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'go_to_page', page: 'doctors', lang, text } }));
            break;
        case 'insurance_query':
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'go_to_page', page: 'insurance', lang, text } }));
            break;
        case 'navigation':
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'navigate', lang, text } }));
            break;
        default:
            window.dispatchEvent(new CustomEvent('system-action', { detail: { action: 'unknown', lang, text } }));
    }
}

// --- 5. Main Controller Entry ---
window.sehatSetuController = function(inputText, isVoice) {
    const lang = detectLanguage(inputText);
    const intentObj = extractIntent(inputText);
    dispatchAction(intentObj, lang, inputText);
    if (isVoice) {
        speakResponse('Command received and executed.');
    }
};

// --- 6. Text-to-Speech (Optional Voice Response) ---
function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-IN';
        window.speechSynthesis.speak(utter);
    }
}

// --- 7. UI: Add Input Box and Voice Button ---
document.addEventListener('DOMContentLoaded', function () {
    // Add input box and mic button to bottom left
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.bottom = '24px';
    box.style.left = '24px';
    box.style.zIndex = '1000';
    box.style.background = '#fff';
    box.style.padding = '8px 10px';
    box.style.borderRadius = '7px';
    box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    box.style.width = '230px';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.gap = '6px';

    const input = document.createElement('input');
    input.id = 'system-command-input';
    input.type = 'text';
    input.placeholder = 'Type or speak command...';
    input.style.width = '120px';
    input.style.padding = '5px 8px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.fontSize = '13px';
    box.appendChild(input);

    const mic = document.createElement('button');
    mic.innerHTML = '🎤';
    mic.title = 'Speak command';
    mic.style.fontSize = '16px';
    mic.style.background = 'none';
    mic.style.border = 'none';
    mic.style.cursor = 'pointer';
    box.appendChild(mic);

    document.body.appendChild(box);

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            window.sehatSetuController(input.value, false);
            input.value = '';
        }
    });
    mic.addEventListener('click', function() {
        startVoiceInput();
    });
});

// --- 8. Listen for system actions (for demo, log to console) ---
window.addEventListener('system-action', function(e) {
    console.log('System Action:', e.detail);
    // TODO: Integrate with frontend navigation, filtering, etc.
});
