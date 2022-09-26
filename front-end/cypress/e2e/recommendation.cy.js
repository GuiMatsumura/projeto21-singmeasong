const recommendation = {
  name: 'Enemy',
  youtubeLink: 'https://www.youtube.com/watch?v=IOrbP1OqNsg',
};

describe('Create Recommendation', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5000/reset', {});
  });

  it('should create a recommendation', () => {
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

  it('should create a duplicated recommendation', () => {
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

    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      recommendation.youtubeLink
    );

    cy.intercept('POST', 'http://localhost:5000/recommendations').as(
      'createRecommendation2'
    );
    cy.get('button').click();
    cy.wait('@createRecommendation2');

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
  });
});

describe('POST upvote', () => {
  it('should upvote in a recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('#upArrow').click();
  });
});

describe('POST downvote', () => {
  it('should downvote in a recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('#downArrow').click();
  });
});

describe('GET recommendation by score', () => {
  it('Should render recommendations by score', () => {
    cy.visit('http://localhost:3000/top/2');
  });
});

describe('GET recommendation random', () => {
  it('Should render random recommendations', () => {
    cy.visit('http://localhost:3000/random');
  });
});
