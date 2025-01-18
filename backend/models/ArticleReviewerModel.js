
module.exports = (db, DataTypes) => {
  const ArticleReview = db.define('ArticleReview', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('acceptat', 'respins', 'neverificat'),
      defaultValue: 'neverificat',
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'article_reviews',
    timestamps: false,
  });

  return ArticleReview;
};

//si in loc sa am o tabela speciala pentru comentarii las aici un camp in care reviewerul poate sa scrie comentariu la articolul respectiv