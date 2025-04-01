type Step = {
  color: string;
  size: number;
};

type getGradientStringFn = (
  gradient: "conic-gradient",
  steps: Step[]
) => string;

// Build a CSS gradient string from an array of steps. Each step has a color and
// a size.
const getGradientString: getGradientStringFn = (gradient, steps) => {
  const stepSize = 100 / steps.reduce((sum, step) => (sum += step.size), 0);

  let lastStep = 0;
  const gradientSteps = steps.reduce((steps: string[], step) => {
    steps.push(`${step.color} ${lastStep}%`);
    lastStep += step.size * stepSize;
    steps.push(`${step.color} ${lastStep}%`);
    return steps;
  }, []);

  return `${gradient}(${gradientSteps.join(",")})`;
};

export default getGradientString;
