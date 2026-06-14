import sql from './client';

interface SeedTask {
  time_label: string;
  title: string;
  description: string;
  phase_name: string;
  phase_order: number;
  sort_order: number;
  color_tag: string;
}

const defaultTasks: SeedTask[] = [
  // Phase 1 — Morning Metabolism
  { time_label: '07:30 AM', title: 'Wake Up & First Flush', description: 'Drink 250ml room-temperature water slowly', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 1, color_tag: 'green' },
  { time_label: '07:35 AM', title: 'Morning Hygiene & Tongue Scraping', description: 'Brush thoroughly, scrape tongue', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 2, color_tag: 'green' },
  { time_label: '07:45 AM', title: 'Morning Fat-Burn Walk', description: '45 minutes brisk walk, ~5000 steps, cushioned shoes', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 3, color_tag: 'green' },
  { time_label: '08:30 AM', title: 'Arch Drills + Wall Sits', description: 'Short foot exercises 3 min + 3×30s wall sits', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 4, color_tag: 'green' },
  { time_label: '08:45 AM', title: 'Shower & Get Ready', description: 'Cool or lukewarm shower, grooming', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 5, color_tag: 'green' },
  { time_label: '09:15 AM', title: 'Modified Breakfast', description: '1 Dosa or 2 Idlis + 3 boiled egg whites or 100g paneer. Protein first.', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 6, color_tag: 'green' },
  { time_label: '09:45 AM', title: 'Pre-Commute Hydration', description: '250ml water before leaving home', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 7, color_tag: 'green' },
  { time_label: '10:00 AM', title: 'Leave for Office', description: 'Head to work', phase_name: 'Phase 1 — Morning Metabolism', phase_order: 1, sort_order: 8, color_tag: 'green' },

  // Phase 2 — Office Hours
  { time_label: '10:30 AM', title: 'Office Check-In', description: 'Maintain structural sitting posture', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 1, color_tag: 'blue' },
  { time_label: '11:30 AM', title: 'Hydration Target 1', description: '500ml water + 60s calf stretch at desk', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 2, color_tag: 'blue' },
  { time_label: '01:20 PM', title: 'Pre-Lunch Cucumber', description: 'Eat 1 medium cucumber with skin 10 min before lunch', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 3, color_tag: 'blue' },
  { time_label: '01:30 PM', title: 'Sequenced Lunch', description: 'Eat vegetables first, then protein, then rice last. Chew 25 times.', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 4, color_tag: 'blue' },
  { time_label: '02:10 PM', title: 'Post-Lunch Walk', description: '20 min casual walk through office corridors', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 5, color_tag: 'blue' },
  { time_label: '03:30 PM', title: 'Hydration Target 2', description: '500ml water slowly', phase_name: 'Phase 2 — Office Hours', phase_order: 2, sort_order: 6, color_tag: 'blue' },

  // Phase 3 — Afternoon & Commute
  { time_label: '04:30 PM', title: 'Hydration Target 3', description: '500ml water', phase_name: 'Phase 3 — Afternoon & Commute', phase_order: 3, sort_order: 1, color_tag: 'amber' },
  { time_label: '05:30 PM', title: 'Zero Snack Window', description: 'No food. Plain black coffee or green tea only if tired.', phase_name: 'Phase 3 — Afternoon & Commute', phase_order: 3, sort_order: 2, color_tag: 'amber' },
  { time_label: '07:00 PM', title: 'Office Check-Out', description: 'Pack up, avoid all processed food on the way home', phase_name: 'Phase 3 — Afternoon & Commute', phase_order: 3, sort_order: 3, color_tag: 'amber' },
  { time_label: '07:30 PM', title: 'Arrive Home + Carrot', description: '250ml water immediately + eat 1 whole raw carrot', phase_name: 'Phase 3 — Afternoon & Commute', phase_order: 3, sort_order: 4, color_tag: 'amber' },

  // Phase 4 — Evening Workout
  { time_label: '07:45 PM', title: 'Evening Depletion Walk', description: '45 min brisk walk, ~5000 steps. Body burns hip fat on empty glycogen.', phase_name: 'Phase 4 — Evening Workout', phase_order: 4, sort_order: 1, color_tag: 'purple' },
  { time_label: '08:30 PM', title: 'Glute Bridges', description: '3 sets × 15 reps. Squeeze hard at top for 2 seconds.', phase_name: 'Phase 4 — Evening Workout', phase_order: 4, sort_order: 2, color_tag: 'purple' },

  // Phase 5 — Night Routine
  { time_label: '09:00 PM', title: 'No-Carb Dinner', description: 'Thick dal soup + egg bhurji (3 eggs + vegetables). Zero white rice.', phase_name: 'Phase 5 — Night Routine', phase_order: 5, sort_order: 1, color_tag: 'red' },
  { time_label: '09:30 PM', title: 'Final Hydration', description: 'Last 250ml water. Completes 3.5–4L daily total.', phase_name: 'Phase 5 — Night Routine', phase_order: 5, sort_order: 2, color_tag: 'red' },
  { time_label: '10:15 PM', title: 'Jawline Mewing', description: 'Lie flat, tongue to roof of mouth, breathe through nose, 10 min.', phase_name: 'Phase 5 — Night Routine', phase_order: 5, sort_order: 3, color_tag: 'red' },
  { time_label: '10:30 PM', title: 'Deep Sleep', description: 'Dark cool room. Lights and phone off.', phase_name: 'Phase 5 — Night Routine', phase_order: 5, sort_order: 4, color_tag: 'red' },
];

export async function seedBlueprint() {
  const existing = await sql`SELECT COUNT(*) as count FROM blueprint_tasks`;
  const count = parseInt(existing[0].count as string, 10);

  if (count > 0) {
    return;
  }

  for (const task of defaultTasks) {
    await sql`
      INSERT INTO blueprint_tasks (time_label, title, description, phase_name, phase_order, sort_order, color_tag)
      VALUES (${task.time_label}, ${task.title}, ${task.description}, ${task.phase_name}, ${task.phase_order}, ${task.sort_order}, ${task.color_tag})
    `;
  }
}
