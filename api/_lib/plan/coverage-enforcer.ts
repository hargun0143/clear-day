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
  const selectedIndoorMap = new Map(
    selectedTopics.indoorAir.map((t) => [t.id, t])
  );
  const returnedTipsMap = new Map(
    plan.indoorAir.tips
      .filter((tip) => selectedIndoorMap.has(tip.topicId))
      .map((tip) => [tip.topicId, tip.text])
  );

  const finalTips = selectedTopics.indoorAir.map((topic) => ({
    topicId: topic.id,
    text: returnedTipsMap.get(topic.id) ?? topic.detail,
  }));

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
    indoorAir: {
      ...plan.indoorAir,
      tips: finalTips,
    },
    lowEmissionChoices: finalSwaps,
    goodHabits: finalHabits.length > 0 ? finalHabits : undefined,
  };
}
