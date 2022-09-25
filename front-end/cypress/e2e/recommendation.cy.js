describe('Create Recommendation', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5000/reset', {});
  });

  it('should create a recommendation', () => {
    const recommendation = {
      name: 'Enemy',
      youtubeLink: 'https://www.youtube.com/watch?v=IOrbP1OqNsg',
    };
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      recommendation.youtubeLink
    );

    cy.intercept('POST', 'http://localhost:5000/recommendations').as(
      'createRecommendation'
    );
    cy.get('button').click();
    cy.wait('@createRecommendation');

    cy.contains(recommendation.name);
  });

  it('Try create without name and link', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
  });
});
