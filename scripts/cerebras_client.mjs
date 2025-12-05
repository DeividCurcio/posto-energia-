import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  // This is the default and can be omitted
  apiKey: process.env['CEREBRAS_API_KEY']
});

async function main() {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: ''
      }
    ],
    model: 'zai-glm-4.6',
    stream: true,
    max_completion_tokens: 40960,
    temperature: 0.6,
    top_p: 0.95
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
