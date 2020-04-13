const factor = (data) => {
  let getFactor;
  if (data.periodType.trim().toLowerCase() === 'days') {
    getFactor = Math.trunc((data.timeToElapse * 1) / 3);
  } else if (data.periodType.trim().toLowerCase() === 'weeks') {
    getFactor = Math.trunc((data.timeToElapse * 7) / 3);
  } else if (data.periodType.trim().toLowerCase() === 'months') {
    getFactor = Math.trunc((data.timeToElapse * 30) / 3);
  } else {
    getFactor = 1;
  }
  return getFactor;
};
const availableBeds = (data) => Math.trunc(0.35 * data.totalHospitalBeds);

const covid19ImpactEstimator = (data) => ({
  data,
  impact: {
    currentlyInfected: data.reportedCases * 10,
    infectionsByRequestedTime: (data.reportedCases * 10) * (2 ** factor(data)),
    severeCasesByRequestedTime: Math.trunc(0.15 * (data.reportedCases * 10) * (2 ** factor(data))),
    hospitalBedsByRequestedTime:
    availableBeds(data) - (Math.trunc(0.15 * (data.reportedCases * 10) * (2 ** factor(data))))
  },
  severeImpact: {
    currentlyInfected: data.reportedCases * 50,
    infectionsByRequestedTime: (data.reportedCases * 50) * (2 ** factor(data)),
    severeCasesByRequestedTime: Math.trunc(0.15 * (data.reportedCases * 50) * (2 ** factor(data))),
    hospitalBedsByRequestedTime:
    availableBeds(data) - (Math.trunc(0.15 * (data.reportedCases * 50) * (2 ** factor(data))))
  }
});
export default covid19ImpactEstimator;
