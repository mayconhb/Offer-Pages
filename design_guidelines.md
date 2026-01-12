# Design Guidelines: Gelatina Bariátrica Landing Page

## Design Approach

**Strategy**: Reference-based approach drawing from health/wellness leaders (MyFitnessPal, Noom, Weight Watchers) combined with medical product credibility (pharmaceutical landing pages). Emphasize trust through clean layouts, ample whitespace, and structured information hierarchy.

**Core Principles**:
- Medical credibility through organized, spacious layouts
- Emotional resonance via authentic imagery and testimonials
- Clear benefit communication without overwhelming users
- Progressive trust building from hero to conversion

## Typography System

**Montserrat Implementation**:
- Hero Headline: Montserrat Bold, 4xl-6xl (text-4xl lg:text-6xl)
- Section Headers: Montserrat SemiBold, 3xl-4xl (text-3xl lg:text-4xl)
- Subheadings: Montserrat Medium, xl-2xl (text-xl lg:text-2xl)
- Body Text: Montserrat Regular, base-lg (text-base lg:text-lg)
- Captions/Labels: Montserrat Medium, sm (text-sm)
- CTAs: Montserrat SemiBold, base-lg (text-base lg:text-lg)

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-8, p-12, p-16
- Section spacing: py-16 (mobile), py-24 (desktop)
- Container: max-w-7xl with px-4 md:px-8
- Content blocks: max-w-4xl for optimal readability
- Grid gaps: gap-8, gap-12

## Component Library

**Hero Section** (Full viewport ~90vh):
- Large hero image (right 60%, content left 40% on desktop, stacked mobile)
- Blurred-background CTA button overlaying image edge
- Trust badge strip below hero (certifications, client count)

**Benefits Grid** (3-column desktop, 1-column mobile):
- Icon + heading + 2-3 sentence description
- Card treatment with subtle elevation
- Even spacing using gap-8

**How It Works** (4-step timeline):
- Horizontal numbered steps (desktop), vertical (mobile)
- Icons representing each step
- Brief description under each

**Before/After Showcase** (2-column comparison):
- Image pairs with slider interaction
- Testimonial quote integration
- Results metrics (weight lost, timeframe)

**Testimonials Carousel** (3 cards visible desktop):
- Customer photo + quote + name/result
- Star ratings
- Rotating carousel with manual controls

**Scientific Backing Section**:
- Split layout: clinical study image left, key findings right
- Bullet points of benefits
- "Learn More" expandable details

**Pricing/CTA Section**:
- Single package focus (avoid choice paralysis)
- Value proposition reinforcement
- Money-back guarantee badge
- Prominent CTA with urgency element

**Trust Footer**:
- Contact information with phone/email
- Certifications and medical disclaimers
- Social proof counters
- Newsletter signup

## Images Section

**Required Images**:

1. **Hero Image**: Professional photograph of the product (gelatin container) with fresh, healthy food elements - berries, water, measuring tape. Clean, bright, clinical aesthetic. Placement: Right side of hero, extends to viewport edge.

2. **Before/After Photos**: 4-6 authentic customer transformation photos showing real results. Clean backgrounds, consistent lighting. Placement: Dedicated comparison section mid-page.

3. **How It Works Icons**: Custom or library icons representing consumption, metabolism, satisfaction, results. Placement: Timeline section.

4. **Clinical/Lab Setting**: Professional image suggesting scientific credibility - lab equipment or medical professional. Placement: Scientific backing section background.

5. **Lifestyle Images**: 2-3 photos of people looking confident, active, happy - representing results. Placement: Scattered throughout benefit sections.

6. **Product Close-ups**: High-quality product photography showing texture, packaging details. Placement: Near pricing section.

## Design Notes

- Buttons on hero image use backdrop-blur-md with semi-transparent background
- Maintain 60/40 visual weight favoring content over decoration
- Use subtle shadows (shadow-sm, shadow-md) for depth, never harsh
- Animations limited to fade-in-on-scroll and subtle hover states
- Mobile-first responsive breakpoints at md (768px) and lg (1024px)
- Forms use clear labeling, generous padding (p-4), validation states