// API utility for Ollama
export async function askOllama(prompt: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'llama3.2', prompt, stream: false }),
    });
    if (!response.ok) {
        throw new Error('Ollama Error: ' + await response.text());
    }
    const data = await response.json();
    return data.response;
}
