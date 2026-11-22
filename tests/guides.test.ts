import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getAllGuides, getGuideBySlug } from '../lib/guides';

describe('Guides pratiques des péages', () => {
  it('contient les 4 guides complets', () => {
    const guides = getAllGuides();
    assert.equal(guides.length, 4);
  });

  it('chaque guide a un titre, des sections et des FAQs', () => {
    const guides = getAllGuides();
    for (const guide of guides) {
      assert.ok(guide.slug.length > 0);
      assert.ok(guide.title.length > 10);
      assert.ok(guide.sections.length >= 3);
      assert.ok(guide.faqs.length >= 2);
    }
  });

  it('récupère le guide du péage en flux libre par son slug', () => {
    const g = getGuideBySlug('peage-flux-libre-sans-barriere-comment-payer');
    assert.ok(g);
    assert.match(g?.title || '', /flux libre/i);
  });
});
