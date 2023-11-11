import { CONSTANS__NAMES_BANKS } from '../utils/isoBanks';
import { getAlfaRank } from './apiBank/Alfa/alfaRank';
import { getBSBRank } from './apiBank/BSB/BSBRank';
import { getBelagroRank } from './apiBank/Belagro/belagroRank';
import { getBelarusbankRank } from './apiBank/Belarusbank/belarusbankRank';
import { getDabrabytRank } from './apiBank/Dabrabyt/dabrabytRank';
import { getMTBRank } from './apiBank/MTB/MTBRank';
import { getPriorRank } from './apiBank/Prior/PriorRank';
import { getRRBRank } from './apiBank/RRB/RRBRank';
import { getReshenieRank } from './apiBank/Reshenie/reshenieRank';
import { getVTBRank } from './apiBank/VTB/VTBRank';

export const getRankBank = () => {
  return [
    { func: getAlfaRank, name: CONSTANS__NAMES_BANKS.ALFA },
    { func: getBelarusbankRank, name: CONSTANS__NAMES_BANKS.BELARUSBANK },
    { func: getDabrabytRank, name: CONSTANS__NAMES_BANKS.DABRABYT },
    { func: getRRBRank, name: CONSTANS__NAMES_BANKS.RRB },
    { func: getBelagroRank, name: CONSTANS__NAMES_BANKS.BELAGRO },
    { func: getReshenieRank, name: CONSTANS__NAMES_BANKS.RESHENIE },
    { func: getVTBRank, name: CONSTANS__NAMES_BANKS.VTB },
    { func: getMTBRank, name: CONSTANS__NAMES_BANKS.MTB },
    { func: getPriorRank, name: CONSTANS__NAMES_BANKS.PRIOR },
    { func: getBSBRank, name: CONSTANS__NAMES_BANKS.BSB },
  ];

  // await this.updateRates(getAlfaRank, CONSTANS__NAMES_BANKS.ALFA),
  //   await this.updateRates(
  //     getBelarusbankRank,
  //     CONSTANS__NAMES_BANKS.BELARUSBANK,
  //   ),
  //   await this.updateRates(getDabrabytRank, CONSTANS__NAMES_BANKS.DABRABYT),
  //   await this.updateRates(getRRBRank, CONSTANS__NAMES_BANKS.RRB),
  //   await this.updateRates(getBelagroRank, CONSTANS__NAMES_BANKS.BELAGRO),
  //   await this.updateRates(getReshenieRank, CONSTANS__NAMES_BANKS.RESHENIE),
  //   await this.updateRates(getVTBRank, CONSTANS__NAMES_BANKS.VTB),
  //   await this.updateRates(getMTBRank, CONSTANS__NAMES_BANKS.MTB),
  //   await this.updateRates(getPriorRank, CONSTANS__NAMES_BANKS.PRIOR),
  //   await this.updateRates(getBSBRank, CONSTANS__NAMES_BANKS.BSB),
};
