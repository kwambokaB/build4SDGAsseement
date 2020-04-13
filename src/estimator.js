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
const impactCurrentlyInfected = (data) => data.reportedCases * 10;
const severCurrentlyInfected = (data) => data.reportedCases * 50;
const avgDailyIncome = (data) => data.region.avgDailyIncomeInUSD;
const avgDailyPopulation = (data) => data.region.avgDailyIncomePopulation;
const availableBeds = (data) => 0.35 * data.totalHospitalBeds;

const ImpactEconomyLoss = (data) => {
  const duration = data.timeToElapse;
  let estimatedLoss;

  if (data.periodType.trim().toLowerCase() === 'days') {
    estimatedLoss = (impactCurrentlyInfected(data) * (2 ** factor(data))
     * avgDailyIncome(data) * avgDailyPopulation(data))
     / duration;
  } else if (data.periodType.trim().toLowerCase() === 'weeks') {
    estimatedLoss = (impactCurrentlyInfected(data) * (2 ** factor(data))
    * avgDailyIncome(data) * avgDailyPopulation(data))
    / (duration * 7);
  } else if (data.periodType.trim().toLowerCase() === 'months') {
    estimatedLoss = (impactCurrentlyInfected(data) * (2 ** factor(data))
    * avgDailyIncome(data) * avgDailyPopulation(data))
    / (duration * 30);
  }
  return estimatedLoss;
};
const severImpactEconomyLoss = (data) => {
  const duration = data.timeToElapse;
  let estimatedLoss;

  if (data.periodType.trim().toLowerCase() === 'days') {
    estimatedLoss = (severCurrentlyInfected(data) * (2 ** factor(data))
     * avgDailyIncome(data) * avgDailyPopulation(data))
     / duration;
  } else if (data.periodType.trim().toLowerCase() === 'weeks') {
    estimatedLoss = (severCurrentlyInfected(data) * (2 ** factor(data))
    * avgDailyIncome(data) * avgDailyPopulation(data))
    / (duration * 7);
  } else if (data.periodType.trim().toLowerCase() === 'months') {
    estimatedLoss = (severCurrentlyInfected(data) * (2 ** factor(data))
    * avgDailyIncome(data) * avgDailyPopulation(data))
    / (duration * 30);
  }
  return estimatedLoss;
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: {
    currentlyInfected: impactCurrentlyInfected(data),
    infectionsByRequestedTime: impactCurrentlyInfected(data) * (2 ** factor(data)),
    severeCasesByRequestedTime:
     Math.trunc(0.15 * impactCurrentlyInfected(data) * (2 ** factor(data))),
    hospitalBedsByRequestedTime:
    Math.trunc(availableBeds(data) - (0.15 * impactCurrentlyInfected(data) * (2 ** factor(data)))),
    casesForICUByRequestedTime: Math.trunc(0.05 * (data.reportedCases * 10) * (2 ** factor(data))),
    casesForVentilatorsByRequestedTime: Math.trunc(
      0.02 * impactCurrentlyInfected(data) * (2 ** factor(data))
    ),
    dollarsInFlight: Math.trunc(ImpactEconomyLoss(data))
  },
  severeImpact: {
    currentlyInfected: severCurrentlyInfected(data),
    infectionsByRequestedTime: severCurrentlyInfected(data) * (2 ** factor(data)),
    severeCasesByRequestedTime:
    Math.trunc(0.15 * severCurrentlyInfected(data) * (2 ** factor(data))),
    hospitalBedsByRequestedTime:
    Math.trunc(availableBeds(data) - (0.15 * severCurrentlyInfected(data) * (2 ** factor(data)))),
    casesForICUByRequestedTime: Math.trunc(
      0.05 * severCurrentlyInfected(data) * (2 ** factor(data))
    ),
    casesForVentilatorsByRequestedTime: Math.trunc(
      0.02 * severCurrentlyInfected(data) * (2 ** factor(data))
    ),
    dollarsInFlight: Math.trunc(severImpactEconomyLoss(data))
  }
});
export default covid19ImpactEstimator;
