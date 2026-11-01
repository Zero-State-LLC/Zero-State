// Ask Zero State - products-only scope. Pure logic, unit-tested with plain Node
// (workers/ask/test/scope.test.mjs).
//
// Two layers:
//   1. precheck() here: a cheap, high-precision filter that refuses only OBVIOUS off-topic requests
//      (coding help, creative writing, math, news, translation) and prompt-injection attempts,
//      before any model call, so they cost nothing. A deny pattern alone never refuses a question
//      that names a Zero State product, skill, service or the studio: those always reach the model.
//      Prompt-injection patterns refuse regardless.
//   2. The system prompt (index.js) is the real scope boundary: anything precheck lets through that
//      is still off-topic gets the same fixed REFUSAL text from the model.
// Precheck is deliberately conservative: when unsure, it lets the question through.

export const CONTACT = 'zer0state@zer0state.com';
export const REFUSAL = `I can only answer questions about Zero State's products and services. Try asking about HexWire, Noema, Pawl or our local-intelligence work, or email ${CONTACT}.`;

// Words that mark a question as about Zero State even if it also trips a deny pattern
// ("write a poem about HexWire" goes to the model, which declines or answers within scope).
const GENERIC_TOPICS = [
	'zero state', 'zer0state', 'zerostate', 'your studio', 'your company', 'your team', 'your product',
	'your app', 'your game', 'your skill', 'agent skill', 'your service', 'local intelligence',
	'local-intelligence', 'client work', 'your portfolio',
];

// Product, skill, client and community names, from the "## Name - Zero State" headings and slugs of pages
// under /products/, /skills/, /clients/, /community/ and /media/ in knowledge.md. New products on
// the site are picked up automatically when knowledge.md is regenerated.
export function extractTopics(knowledge) {
	const topics = new Set(GENERIC_TOPICS);
	const re = /^## (.+)\nURL: https:\/\/zer0state\.com\/(?:products|skills|clients|community|media)\/([a-z0-9-]+)\.html/gm;
	for (const [, heading, slug] of knowledge.matchAll(re)) {
		topics.add(slug);   // page slug, e.g. "orchestra" for Abraxas Orchestra
		topics.add(slug.replace(/-/g, ' '));
		for (const part of heading.split(/\s+[\u2014\u00b7|-]\s+/)) {
			const name = part.trim().toLowerCase();
			if (!name || name === 'zero state' || name.length < 3) continue;
			topics.add(name);
			topics.add(name.replace(/[-.]/g, ' ').replace(/\s+/g, ' ').trim());
			if (name.includes('.')) topics.add(name.split('.')[0]);   // "autogive.app" -> "autogive"
		}
	}
	return [...topics];
}

export function mentionsTopic(text, topics) {
	const t = ` ${text.toLowerCase().replace(/[^a-z0-9.\- ]+/g, ' ').replace(/\s+/g, ' ')} `;
	return topics.some((topic) => t.includes(` ${topic} `) || t.includes(` ${topic}s `) || t.includes(` ${topic}'`) || t.includes(` ${topic}.`));
}

// Always refused, product name or not.
const INJECTION = [
	/\b(ignore|disregard|forget|override|bypass)\b[^.?!\n]{0,40}\b(instructions?|rules|prompts?|guidelines|restrictions|guardrails)\b/i,
	/\b(system|initial|hidden|original|developer)\s+(prompt|instructions|message)\b/i,
	/\b(developer|god|jailbreak|dan|unrestricted)\s+mode\b/i,
	/\bno\s+(restrictions|rules|filters|guardrails)\b/i,
	/\byou are now\b/i,
	/\b(repeat|print|show|reveal|output)\b[^.?!\n]{0,30}\b(text|words|instructions|prompt)\s+(above|before)\b/i,
];

// Refused only when the question does not name Zero State or one of its products.
const OFF_TOPIC = [
	// coding help
	/```|\bTraceback \(most recent call last\)|\b[A-Z][a-zA-Z]*(Error|Exception):|\bdef \w+\(|\bfunction\s*\w*\s*\(|console\.log|#include\s*</,
	/\b(python|javascript|typescript|java|c\+\+|c#|rust|golang|php|ruby|sql|regex|css|html|react|flask|django|node(\.js)?)\b[^.?!\n]{0,60}\b(help|fix|debug|error|bug|write|code|script|function|query)\b/i,
	/\b(fix|debug|refactor)\b[^.?!\n]{0,20}\b(my|this|the following)\s+(code|error|bug|script|function|query)\b/i,
	// creative writing
	/\b(write|compose|generate|create|make)\b[^.?!\n]{0,30}\b(poem|story|essay|song|haiku|limerick|lyrics|rap|sonnet|cover letter|joke)s?\b/i,
	/\btell me a (joke|story)\b/i,
	// math and homework
	/\b(derivative|integral|integrate|differentiate|solve for|square root|factorial|logarithm|quadratic)\b/i,
	/\b\d+(\.\d+)?\s*(?:[+*\/^]|times|plus|minus|divided by|multiplied by)\s*\d+(\.\d+)?\b/i,
	// news, weather, markets
	/\b(news|headlines|weather|forecast|stock (price|market)|stocks|crypto(currency)?|bitcoin|election results?)\b/i,
	// translation
	/\btranslate\b/i,
];

// Returns null to let the question through to the model, or a short reason string to refuse it.
export function precheck(text, topics) {
	if (INJECTION.some((re) => re.test(text))) return 'injection';
	if (OFF_TOPIC.some((re) => re.test(text)) && !mentionsTopic(text, topics)) return 'off_topic';
	return null;
}
