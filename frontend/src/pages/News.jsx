import './News.css';

const News = () => {
  const newsItems = [
    {
      id: 1,
      date: {
        month: 'Dec',
        day: '12',
        year: '2025'
      },
      title: 'Research Publication: Computational Modelling of Fluid Transport in Poroelastic Interfaces',
      description: 'We are pleased to announce the publication of our cartilage model research paper in the Tribology International journal.',
      link: 'https://doi.org/10.1016/j.triboint.2025.111541'
    },
    {
      id: 2,
      date: {
        month: 'July',
        day: '04',
        year: '2025'
      },
      title: 'Research Publication: The role of lubrication in function and degeneration of articular cartilage',
      description: 'We are pleased to announce the publication of our perspectives on cartilage modelling in the Progress in Biomedical Engineering journal.',
      link: 'https://iopscience.iop.org/article/10.1088/2516-1091/ade839'
    }
  ];

  return (
    <section id="news">
      <div className="news-container">
        <div className="news-header">
          <h2>News</h2>
          <p className="news-subtitle">Latest updates and research publications</p>
        </div>

        <div className="news-grid">
          {newsItems.map((item) => (
            <article key={item.id} className="news-card">
              <div className="news-date">
                <span className="news-month">{item.date.month}</span>
                <span className="news-day">{item.date.day}</span>
                <span className="news-year">{item.date.year}</span>
              </div>
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                <a 
                  href={item.link} 
                  className="news-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Publication →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;