export async function POST(request) {
  try {
    const { bubbles, apiKey } = await request.json();
    if (!bubbles?.length) return Response.json({ translations: {} });

    const lines = bubbles.map((b) => `${b.id}|||${b.text}`).join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{
          role: "user",
          content: `Translate these English comic texts to Arabic. Keep it natural and concise for comic speech bubbles.

Texts (id|||text):
${lines}

Respond with ONLY a JSON object, nothing else:
{"translations":{"1":"الترجمة هنا","2":"ترجمة أخرى"}}

Output JSON only.`
        }]
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return Response.json({ error: err.error?.message || "API error" }, { status: response.status });
    }

    const data = await response.json();
    const text = (data.content || []).find((b) => b.type === "text")?.text || "";

    let s = text.replace(/```(?:json)?/gi, "").trim();
    const start = s.indexOf("{"), end = s.lastIndexOf("}");
    if (start === -1 || end === -1) return Response.json({ error: "JSON parse error" }, { status: 500 });
    s = s.slice(start, end + 1).replace(/,(\s*[}\]])/g, "$1");
    const parsed = JSON.parse(s);

    // Normalize to { id: arabic } map
    let trMap = {};
    if (parsed.translations && !Array.isArray(parsed.translations)) {
      trMap = parsed.translations;
    } else if (Array.isArray(parsed.translations)) {
      parsed.translations.forEach((t) => { trMap[String(t.id)] = t.arabic || ""; });
    }

    return Response.json({ translations: trMap });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
