import assert from 'node:assert/strict';
import { radarScore, radarTier } from '../static-site/src/lib/radar';

const core = radarScore({
  topic: 'math.DG:geometric-analysis',
  priorityScore: 80,
  text: 'Yamabe isolated singularity and bubble compactness',
});
assert.equal(radarTier(core), 'core');

const related = radarScore({
  topic: 'math.AP:elliptic-parabolic',
  priorityScore: 60,
  text: 'Boundary regularity and stability for a degenerate parabolic equation',
});
assert.equal(radarTier(related), 'related');

const unrelated = radarScore({
  topic: 'math.AP:dispersive',
  priorityScore: 60,
  text: 'Fourier restriction estimate for a dispersive model',
});
assert.equal(radarTier(unrelated), null);

console.log('radar tests passed');
