# Runway Video Guide: 60-Second Coaching Intro

A credit-efficient workflow for a cinematic, B-roll + voiceover intro video, plus instructions for inserting a short AI-generated clip of you speaking on camera.

---

## The strategy in one paragraph

Generating a full 60 seconds of talking-head AI video is the most expensive thing you can do in Runway, and it almost never looks as good as real people on camera. Instead, build the video as a **voiceover-driven cinematic montage**: you record (or AI-generate) the narration once, and Runway only has to generate ~6–8 short B-roll clips that visually support what's being said. Then, for the personal touch, generate **one short clip of your face speaking** at the very beginning or end using Runway's **Act-Two** feature. This combination looks far more polished than a 60-second AI talking head, and uses roughly a quarter of the credits.

---

## Step 1 — The script (60 seconds, ~145 words)

Read this out loud at a natural pace; it lands at about 58 seconds.

> **[0:00–0:08]** Most people don't come to coaching because something is broken. They come because they sense there's more — more clarity, more momentum, more of the life they actually want to be living.
>
> **[0:08–0:20]** Personal coaching is a structured conversation. Each week, we sit down — in person or on a call — and we look honestly at where you are, where you want to go, and what's quietly standing in the way.
>
> **[0:20–0:35]** It isn't therapy, and it isn't advice. It's a thinking partnership. I ask the questions that help you see your situation differently, and together we build the small, repeatable actions that move you forward.
>
> **[0:35–0:50]** Clients come for career transitions, for relationships, for confidence, for direction. What they leave with is the same thing: a clearer sense of who they are and what's next.
>
> **[0:50–0:60]** If any of that resonates, let's talk.

Record this in one quiet take on your phone (Voice Memos works fine). Your real voice is the strongest brand asset you have — don't replace it with an AI voice unless you absolutely have to.

---

## Step 2 — Storyboard (script → clips)

This is the map you'll work from inside Scene Builder. Six scenes telling a **transformation arc**: a person who is stuck and worried, finds coaching, and emerges confident.

| # | Time | Scene | Mood / purpose |
|---|------|-------|----------------|
| 1 | 0:00–0:10 | Protagonist sitting alone on a commuter train, looking out the window with a worried, contemplative face | The "before" — sets up that something quietly isn't right |
| 2 | 0:10–0:20 | Same protagonist in a corporate meeting room, looking down thoughtfully and worriedly while colleagues talk in the background | Reinforces the inner conflict in a professional setting |
| 3 | 0:20–0:30 | The protagonist in a 1-on-1 in-person coaching session, sitting face-to-face with a coach in a warm room | Introduces coaching itself — the in-person modality |
| 4 | 0:30–0:40 | The protagonist on a video call with a coach, at a clean desk with a laptop, taking notes | Shows the same coaching works remotely too |
| 5 | 0:40–0:50 | The same protagonist back on the train, now with a soft, confident smile — they know what to do | Visual "after" — the transformation, mirroring Scene 1 |
| 6 | 0:50–0:60 | The protagonist back in a meeting room, leaning forward and speaking with confidence, colleagues engaged and smiling | The result — clarity translated into action, mirroring Scene 2 |

**Why the mirroring matters:** Scenes 5 and 6 are deliberate visual rhymes of Scenes 1 and 2 — same locations, same character, different inner state. That's what makes a transformation story land in 60 seconds without needing words to explain it.

### Critical: set up your character first in Scene Builder

Five of these six scenes (and arguably all six) show the **same person**. Without locking the character, Runway will generate a slightly different-looking human in every scene and the whole arc falls apart.

Before generating any video clips:

1. In **Gen-4 Image**, generate one strong portrait of your protagonist: `Medium portrait of a person in their 30s, neutral expression, natural daylight, plain soft grey background, sharp focus on face, photorealistic, 50mm lens.` Iterate until you love this single image — it becomes your visual anchor.
2. In **Scene Builder**, open the **Characters** panel and create a new character using that image as the reference.
3. For each of the 6 scenes below, **insert that character reference** into the scene prompt (Scene Builder will surface it as a dropdown or chip in the prompt box). This is what keeps the same face and body throughout.
4. Optionally, repeat the process for the coach in Scenes 3 and 4 if you want that character to also stay consistent across both shots.

This step adds maybe 10 minutes and saves dozens of credits in re-rolls later.

---

## Step 3 — Runway settings cheat sheet (credit-efficient)

| Setting | Use this | Why |
|---|---|---|
| Model | **Gen-4 Turbo (Image to Video)** | ~60% cheaper per second than full Gen-4, with quality good enough for short web clips. |
| Input | **Image-to-video, not text-to-video** | Text-to-video is a coin flip and wastes credits on retries. Generate a still first, then animate it — far more predictable. |
| Clip length | **5 seconds** (extend only if needed) | Generating one 10-sec clip costs the same as two 5-sec clips, but a single failed 10-sec clip wastes twice the credits. |
| Resolution | **720p** for drafting, **1080p** only for the final keepers | Drafting at 720p saves credits while you iterate on the prompt. |
| Camera motion | Use the **Camera Control** sliders (pan, push-in, tilt) instead of describing motion in the prompt | Far more reliable and uses no extra credits. |
| Seed | **Lock the seed** when you get a good frame, then iterate | Stops Runway from re-rolling the look on every attempt. |

**Rule of thumb on credits (Gen-4 Turbo, 5-sec clip at 720p):** budget ~25 credits per clip generation. Plan for 1.5 attempts per clip on average → ~40 credits per *final* clip × 7 B-roll clips ≈ **280 credits**, plus the Act-Two face clip (see below). Well inside your Pro budget.

---

## Step 4 — The production workflow (in order)

1. **Record the voiceover first.** Open Voice Memos, read the script in one calm take, save the file. Length now locked.
2. **Generate the 7 still images** for clips 1–7 using Runway's **Gen-4 Image** (image generator) — one image per scene from the storyboard. Use the prompt library below. This costs ~5 credits per image, ~35 total. Approve the still *before* animating — never animate an image you wouldn't be proud of as a photo.
3. **Animate each approved still** using Gen-4 Turbo Image-to-Video, 5 seconds, 720p. Use camera-motion sliders for movement.
4. **Generate the Act-Two talking-head clip** for the closer (see Step 5).
5. **Upscale only the final keepers** to 1080p using Runway's upscaler — don't upscale anything you might cut.
6. **Edit it together** in CapCut (free), DaVinci Resolve (free), or Runway's built-in editor: drop in the voiceover on the audio track, lay the 8 clips against it following the storyboard timings, add a 1-second cross-dissolve between each. Add soft instrumental background music at -20dB so it doesn't fight your voice.
7. **Export** at 1080p, H.264, ~10 Mbps. Compress for web with [Handbrake](https://handbrake.fr/) or upload to your site as MP4.

---

## Step 5 — How to add your face (Runway Act-Two)

Runway **Act-Two** generates a clip of a character (built from your photo) performing a "driving performance" you film of yourself. It's the right tool for clip #8.

### What you need to prepare
- **3–5 reference photos of your face**, all from the same recent shoot if possible:
  - One straight-on, eyes to camera, neutral expression, no glasses, even lighting on both sides of your face. *This is the most important one.*
  - One slight left turn (~15°), one slight right turn (~15°).
  - One smiling, one neutral.
- All photos should be at least 1024×1024, well-lit (window light is great), with a plain background. Avoid hats, sunglasses, busy backgrounds, or heavy shadows — the model uses these references to lock your identity.

### What to film as the driving performance
- Open your phone's front camera, hold it at eye level, ~50cm away.
- Film yourself saying the closing line — "If any of that resonates, let's talk" — three times, with natural expression and direct eye contact. Don't over-act; subtle works better.
- Pick the best take, trim it to ~8 seconds.

### In Runway
1. Open Act-Two and start a new generation.
2. Upload your **character image** (the straight-on photo). If Runway asks for additional reference angles, add the others.
3. Upload your **driving performance video** (the 8-second phone clip).
4. Settings: **720p, 24 fps**. Leave expressiveness around the middle on the first attempt.
5. Generate. Cost is roughly 5 credits per second of output ≈ **40 credits** for an 8-sec clip.
6. If the lip sync is off or the eyes look dead, regenerate with a slightly different driving take rather than tweaking the reference — that's almost always what fixes it.

### Why only one Act-Two clip?
Act-Two is impressive, but uncanny-valley risk goes up the longer the clip runs. An 8-second close on your face at the end of a polished cinematic intro hits "personal touch" without giving the AI long enough to slip into the uncanny zone.

---

## Step 6 — Prompt library

Copy-paste these into **Scene Builder** scene-by-scene. Each prompt assumes you've already created your character (see Step 2) and that you'll insert that character reference into the prompt where it says **[CHARACTER]**. Format follows Runway's preferred order: subject, environment, lighting, lens, mood.

1. **Train, worried (Scene 1)** — `Cinematic medium shot of [CHARACTER] sitting alone in a window seat on a modern commuter train, looking out at passing scenery, brow slightly furrowed, contemplative and slightly worried expression, soft overcast natural window light, shallow depth of field, 50mm lens, muted cool color grade, photorealistic.`
2. **Meeting room, worried (Scene 2)** — `Cinematic medium shot of [CHARACTER] sitting at a conference table in a bright modern meeting room, two colleagues talking softly out of focus in the background, [CHARACTER] looking down at the table with a worried, distracted, thoughtful expression, mixed daylight and overhead office light, 50mm lens, muted color grade, photorealistic.`
3. **In-person coaching (Scene 3)** — `Cinematic over-the-shoulder shot of [CHARACTER] sitting in an armchair facing a coach in another armchair, in a warm wood-paneled office with a soft floor lamp and a plant in the corner, both leaning gently forward in conversation, late afternoon window light, shallow depth of field, 50mm lens, calm and grounded mood, photorealistic.`
4. **Video call coaching (Scene 4)** — `Cinematic medium shot of [CHARACTER] sitting at a clean wooden desk in a softly lit home office, looking at a laptop screen showing a coach on a video call, an open notebook and pen in front of them, focused and engaged expression, warm window light from the left, 50mm lens, photorealistic.`
5. **Train, confident (Scene 5)** — `Cinematic medium shot of [CHARACTER] in the same window seat on the same commuter train as before, soft confident smile, looking forward with quiet certainty, warm morning light through the window, shallow depth of field, 50mm lens, warmer color grade than before, photorealistic.`
6. **Meeting room, leading (Scene 6)** — `Cinematic medium shot of [CHARACTER] at a conference table in the same bright modern meeting room as before, now leaning forward and speaking with energy, three colleagues smiling and engaged around them, natural window light, 50mm lens, warm uplifting mood, photorealistic.`

**Tip for the "same location, different mood" pairs (1↔5 and 2↔6):** when generating Scenes 5 and 6, use the **approved still from Scene 1 or 2 as an additional image reference** in Scene Builder, alongside your character reference. That visually locks the location so the train carriage and meeting room actually look like the same places. The viewer's brain registers the rhyme subconsciously and the transformation feels real.

**Camera motion settings** (apply via the Camera Control sliders in Scene Builder, not in the prompt):
- Scene 1: slow push-in toward the face
- Scene 2: subtle slow pan left
- Scene 3: hold (no motion) — let the conversation breathe
- Scene 4: very slow push-in on the laptop screen
- Scene 5: slow push-in toward the face (mirrors Scene 1)
- Scene 6: subtle slow pan right (mirrors Scene 2 in reverse)

---

## Step 7 — Credit budget

Each scene now runs ~10 seconds. The credit-efficient way to get there is to **generate a 5-sec clip first, approve it, then use Runway's Extend feature to add 5 more seconds**. That way a bad generation costs half as much as a failed 10-sec attempt.

| Item | Credits (approx.) |
|---|---|
| 1 character anchor portrait + 6 scene stills (Gen-4 Image) | 35 |
| 6 scenes × 5-sec first-pass video (Gen-4 Turbo, 720p) | 150 |
| 6 scenes × 5-sec Extend to reach 10s | 150 |
| ~30% re-rolls across both passes | 90 |
| Upscale 6 final 10-sec clips to 1080p | 120 |
| **Subtotal — pure B-roll version** | **~545 credits** |
| *Optional:* swap Scene 6 or add a 6-sec Act-Two opener of you | +30 |
| **Total with personal Act-Two touch** | **~575 credits** |

You have 2,250+/mo on Pro, so even the fuller version is roughly **26% of your monthly allocation** — comfortable room to iterate.

### Where does your face fit in this storyboard?

The new transformation arc tells the client's story, not yours, so there's no natural slot for your face inside the 6 scenes. You have three good options:

- **Skip Act-Two for this video.** The arc works without it. Save Act-Two for a separate "Meet your coach" video.
- **Add a 4-second Act-Two opener before Scene 1.** A brief shot of you saying "Most people don't come to coaching because something is broken…" — then cut to the train. This frames the whole arc as something you're narrating.
- **Add a 4-second Act-Two closer after Scene 6** delivering only the final line: "If any of that resonates, let's talk." This is the highest-impact placement — your face is the last thing the viewer sees.

If you do add an Act-Two clip, follow Step 5 — the prep is identical.

---

## Step 8 — Putting it on your website

- Export as MP4 (H.264, ~10 Mbps, 1080p).
- Run it through Handbrake with the "Web Optimized" preset — usually drops the file size 50% with no visible quality loss.
- On your site, embed with `<video autoplay muted loop playsinline>` if it's the hero clip (must be muted for autoplay to work in browsers), or with full controls if it's a click-to-play "About" video.
- Always include a poster image (export a still frame) so the first paint isn't a black box while the video loads.

---

## Common pitfalls to avoid

- **Don't generate 10-second clips when 5 will do.** Same cost per second, double the loss when one is bad.
- **Don't text-to-video.** Always go image → video. Predictability is everything when credits are on the line.
- **Don't write camera motion in the prompt.** Use the sliders. The model ignores or mangles "slow zoom in" in text more often than not.
- **Don't upscale until you've picked your final 8.** Upscaling is the second-largest cost after generation.
- **Don't try to make Act-Two carry the whole video.** It's a seasoning, not the main dish.

---

*Save this file and keep it open in a second window while you work in Runway. The storyboard table and the prompt library are the two sections you'll come back to most.*
