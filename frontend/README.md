# GigShield Pro

Build a modern, premium, AI-powered web application called "GigShield".

GigShield helps gig workers (Swiggy, Zomato, Uber, Rapido, Blinkit, etc.) track their earnings, detect unfair payouts using AI, and manage jobs from multiple gig platforms in one unified dashboard.

The application should feel like a real funded startup, not a student project.

------------------------------------------------------------

DESIGN STYLE

------------------------------------------------------------

Take inspiration from:

• Stripe Dashboard

• Linear

• Vercel

• Arc Browser

• Apple

• Notion AI

Use a dark theme with glassmorphism, subtle gradients, premium typography, soft shadows, and smooth micro-interactions.

Avoid generic admin dashboards or Bootstrap-like designs.

Use plenty of whitespace.

Rounded corners (18–24px).

Soft glowing borders.

Professional SaaS design.

------------------------------------------------------------

COLOR PALETTE

------------------------------------------------------------

Background:

#060816

Secondary:

#101828

Cards:

rgba(255,255,255,0.05)

Borders:

rgba(255,255,255,0.08)

Primary:

#3B82F6

Secondary Accent:

#06B6D4

Purple Accent:

#8B5CF6

Success:

#22C55E

Warning:

#F59E0B

Danger:

#EF4444

------------------------------------------------------------

TYPOGRAPHY

------------------------------------------------------------

Use Plus Jakarta Sans or Inter.

Large bold headings.

Minimal text.

Clean spacing.

------------------------------------------------------------

BACKGROUND

------------------------------------------------------------

The entire application should have:

• Animated mesh gradient

• Floating blurred gradient blobs

• Subtle grid overlay

• Tiny moving particles

• Soft glow behind important cards

Everything should feel alive without being distracting.

------------------------------------------------------------

ANIMATIONS

------------------------------------------------------------

Use Framer Motion throughout.

Nothing should instantly appear.

Everything should animate naturally.

Dashboard loads in sequence:

Logo fades

↓

Sidebar slides in

↓

Navbar fades

↓

Stat cards pop

↓

Numbers count upward

↓

Charts draw themselves

↓

Recent jobs appear one after another

Cards should:

• Slightly lift on hover

• Rotate 2–3 degrees following mouse movement

• Have glowing borders on hover

Buttons:

• Scale slightly

• Animated gradient

• Smooth shadows

Charts:

• Animated line drawing

• Area fill animation

Sidebar:

• Smooth expand/collapse

Icons:

• Gentle bounce or rotation on hover

Notifications:

Slide in from the top-right and disappear smoothly.

------------------------------------------------------------

APPLICATION STRUCTURE

------------------------------------------------------------

Left Sidebar

Dashboard

Log Job

History

AI Copilot

Profile

------------------------------------------------------------

PAGE 1

DASHBOARD

------------------------------------------------------------

Top hero section showing four animated statistics.

Total Earnings

Hours Worked

Platforms Used

Flagged Jobs

Each card should have an icon, animated number counter, and subtle hover tilt.

Below that:

Animated Weekly Earnings Line Chart.

Below:

Platform Earnings comparison cards.

Examples:

Swiggy

Uber

Rapido

Blinkit

Each card should contain

Platform logo

Amount earned

Percentage change

Animated progress bar

Below:

Recent Jobs section

Each row should animate in one after another.

Status badges:

Fair

Review

Underpaid

with green, yellow and red indicators.

------------------------------------------------------------

PAGE 2

LOG JOB

------------------------------------------------------------

Beautiful hero card.

Large heading:

How would you like to log today's job?

Two large interactive cards:

Manual Entry

Upload Screenshot

When Manual Entry is clicked:

A beautiful animated form slides upward.

Fields:

Platform

Fare

Distance

Time

Date

Save Job button

When Upload Screenshot is clicked:

A drag-and-drop upload zone expands.

Large upload icon.

Animated dashed border.

------------------------------------------------------------

OCR EXPERIENCE

------------------------------------------------------------

This should feel futuristic.

User uploads screenshot.

Image smoothly flies to the center.

Blue scanning beam moves across image.

Detected values appear one after another.

✓ Fare

✓ Distance

✓ Time

Numbers count upward.

Then

Job Saved Successfully animation.

------------------------------------------------------------

PAGE 3

HISTORY

------------------------------------------------------------

Instead of a boring table, display modern cards.

Each card includes:

Platform icon

Fare

Distance

Duration

Date

Fairness status

Hovering reveals:

View AI Analysis button.

Cards animate while scrolling.

------------------------------------------------------------

PAGE 4

AI COPILOT

------------------------------------------------------------

This should feel like ChatGPT mixed with a financial advisor.

Large hero card.

Animated AI orb.

Glowing pulse effect.

Typing introduction.

Example:

This week you completed 34 gigs across 4 platforms.

Estimated earnings:

₹7,430

Estimated loss due to underpaid gigs:

₹438

Overall GigShield Score:

91/100

Below this display AI Insight Cards.

Examples:

Avoid deliveries paying below ₹20/km.

Uber paid 18% higher this week.

Friday evenings generated the highest earnings.

Tuesday afternoon had the most underpaid gigs.

Cards should appear one after another.

Below that:

Fairness Analysis.

Expected Fare

Actual Fare

Difference

Fairness Score

Progress Ring animation.

Then

AI Chat.

Modern ChatGPT-style interface.

Typing animation.

Suggested prompts:

Why was this ride flagged?

Compare all my platforms.

Show earning trends.

Which platform is best?

------------------------------------------------------------

PROFILE

------------------------------------------------------------

Modern profile page.

User avatar.

Daily earning goal.

Preferred platforms.

Total jobs completed.

Average fairness score.

Achievement badges.

------------------------------------------------------------

MICROINTERACTIONS

------------------------------------------------------------

Everything should feel premium.

Hover animations everywhere.

Cards tilt.

Buttons pulse.

Icons rotate slightly.

Progress bars animate.

Numbers count.

Charts draw themselves.

Tooltips fade.

Page transitions should be smooth.

------------------------------------------------------------

EXTRA PREMIUM TOUCHES

------------------------------------------------------------

Glassmorphism throughout.

Gradient borders.

Soft glowing shadows.

Animated loading skeletons.

Lottie animations where appropriate.

Beautiful empty states.

Professional toast notifications.

Command palette style search.

Dark mode only.

Every interaction should feel polished, modern, and startup-quality.

The goal is to create a UI that looks worthy of winning a national-level hackathon and resembles a production-ready fintech SaaS product rather than a student dashboard.
Do NOT generate a generic admin dashboard.

Prioritize visual storytelling over dense information.

The interface should immediately impress judges within the first 10 seconds.

Use asymmetrical layouts, oversized hero sections, premium whitespace, layered cards, floating glass panels, subtle gradients, and smooth page transitions.

Every page should feel intentionally designed like a modern startup product. Avoid template-like layouts. The final result should resemble a premium product from Stripe, Linear, Vercel, or Notion AI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f4590b17-866c-4ca0-b228-bee29e3c922e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
