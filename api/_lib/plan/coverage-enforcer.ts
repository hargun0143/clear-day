import { DIY_BOX_FAN_FILTER } from "./knowledge-sheet.js";
import type { GeneratedPlan } from "./plan-schema.js";
import type { KnowledgeTopic } from "./topics/indoor-topics-data.js";
import type { GoodHabitTopic } from "./topics/select-good-habits.js";

export function enforceTopicCoverage(
  plan: GeneratedPlan,
  selectedTopics: {
    indoorAir: readonly KnowledgeTopic[];
    swaps: readonly KnowledgeTopic[];
    goodHabits: readonly GoodHabitTopic[];
  },
  isUnder18: boolean
): GeneratedPlan {
  const hasDiyTopic = selectedTopics.indoorAir.some(
    (t) => t.id === "diy-filter"
  );
  const tipTopics = selectedTopics.indoorAir.filter(
    (t) => t.id !== "diy-filter"
  );
  const selectedIndoorMap = new Map(tipTopics.map((t) => [t.id, t]));
  const returnedTipsMap = new Map(
    plan.indoorAir.tips
      .filter((tip) => selectedIndoorMap.has(tip.topicId))
      .map((tip) => [tip.topicId, tip.text])
  );

  const finalTips = tipTopics.map((topic) => ({
    topicId: topic.id,
    text: returnedTipsMap.get(topic.id) ?? topic.detail,
  }));

  const diyFilter = hasDiyTopic
    ? {
        include: true,
        materials:
          plan.indoorAir.diyFilter.materials.length > 0
            ? plan.indoorAir.diyFilter.materials
            : [...DIY_BOX_FAN_FILTER.materials],
        steps:
          plan.indoorAir.diyFilter.steps.length > 0
            ? plan.indoorAir.diyFilter.steps
            : [...DIY_BOX_FAN_FILTER.steps],
        safetyNote:
          plan.indoorAir.diyFilter.safetyNote.trim().length > 0
            ? plan.indoorAir.diyFilter.safetyNote
            : DIY_BOX_FAN_FILTER.safetyNotes.join(" "),
      }
    : { include: false, materials: [], steps: [], safetyNote: "" };

  let finalSwaps = plan.lowEmissionChoices;
  if (isUnder18) {
    finalSwaps = [];
  } else {
    const selectedSwapsMap = new Map(
      selectedTopics.swaps.map((s) => [s.id, s])
    );
    const returnedSwapsMap = new Map(
      plan.lowEmissionChoices
        .filter((c) => selectedSwapsMap.has(c.topicId))
        .map((c) => [c.topicId, { swap: c.swap, benefit: c.benefit }])
    );
    finalSwaps = selectedTopics.swaps.map((swap) => {
      const returned = returnedSwapsMap.get(swap.id);
      return {
        topicId: swap.id,
        swap: returned ? returned.swap : swap.title,
        benefit: returned ? returned.benefit : swap.detail,
      };
    });
  }

  const selectedHabitsMap = new Map(
    selectedTopics.goodHabits.map((h) => [h.id, h])
  );
  const returnedHabitsMap = new Map(
    (plan.goodHabits ?? [])
      .filter((h) => selectedHabitsMap.has(h.topicId))
      .map((h) => [h.topicId, h.text])
  );
  const finalHabits = selectedTopics.goodHabits.slice(0, 3).map((habit) => ({
    topicId: habit.id,
    text: returnedHabitsMap.get(habit.id) ?? habit.text,
  }));

  return {
    ...plan,
    indoorAir: { diyFilter, tips: finalTips },
    lowEmissionChoices: finalSwaps,
    goodHabits: finalHabits.length > 0 ? finalHabits : undefined,
  };
}
