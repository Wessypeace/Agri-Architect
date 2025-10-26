function PestShield({ ipmSolution, t }) {
  if (!ipmSolution) {
    return null;
  }

  return (
    <div className="results-card pest-shield">
      <h2>{t('results.pestShieldTitle')}</h2>
      <div className="pest-details">
        <h3>{ipmSolution.title}</h3>
        <p>{ipmSolution.description}</p>
      </div>
    </div>
  );
}

export default PestShield;