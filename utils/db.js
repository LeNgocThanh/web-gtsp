import Datastore from 'nedb';
import path from 'path';

const productsDb = new Datastore({
  filename: path.join(process.cwd(), 'database/products.db'),
  autoload: true,
});

const articlesDb = new Datastore({
  filename: path.join(process.cwd(), 'database/articles.db'),
  autoload: true,
});

const businessPartnerDb = new Datastore({
  filename: path.join(process.cwd(), 'database/businessPartner.db'),
  autoload: true,
});

const newsDb = new Datastore({
  filename: path.join(process.cwd(), 'database/news.db'),
  autoload: true,
});

const membersDb = new Datastore({
  filename: path.join(process.cwd(), 'database/members.db'),
  autoload: true,
});

const homeDb = new Datastore({
  filename: path.join(process.cwd(), 'database/home.db'),
  autoload: true,
});

export { productsDb, articlesDb, businessPartnerDb, newsDb, membersDb, homeDb };