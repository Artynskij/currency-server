import { CONSTANTS__NAMES_BANKS } from '../utils/isoBanks';
import { getAlfaRank } from './apiBank/Alfa/alfaRank';
import { getBSBRank } from './apiBank/BSB/BSBRank';
import { getBelagroRank } from './apiBank/Belagro/belagroRank';
import { getBelarusbankRank } from './apiBank/Belarusbank/belarusbankRank';
import { getBelwebRank } from './apiBank/Belweb/belwebRank';
import { getDabrabytRank } from './apiBank/Dabrabyt/dabrabytRank';
import { getMTBRank } from './apiBank/MTB/MTBRank';
import { getPriorRank } from './apiBank/Prior/PriorRank';
import { getRRBRank } from './apiBank/RRB/RRBRank';
import { getReshenieRank } from './apiBank/Reshenie/reshenieRank';
import { getSberRank } from './apiBank/Sber/sberRank';
import { getVTBRank } from './apiBank/VTB/VTBRank';
import { getBNBRank } from './parsingBanks/BNB/BNBRank';
import { getBelGazRank } from './parsingBanks/BelGaz/belGazRank';
import { getBelInvestRank } from './parsingBanks/BelInvest/belInvestRank';
import { getParitetRank } from './parsingBanks/Paritet/paritetRank';

export const getRankBank = () => {
  return [
    { func: getAlfaRank, name: CONSTANTS__NAMES_BANKS.ALFA },
    { func: getBelarusbankRank, name: CONSTANTS__NAMES_BANKS.BELARUSBANK },
    { func: getDabrabytRank, name: CONSTANTS__NAMES_BANKS.DABRABYT },
    { func: getRRBRank, name: CONSTANTS__NAMES_BANKS.RRB },
    { func: getBelagroRank, name: CONSTANTS__NAMES_BANKS.BELAGRO },
    { func: getReshenieRank, name: CONSTANTS__NAMES_BANKS.RESHENIE },
    { func: getVTBRank, name: CONSTANTS__NAMES_BANKS.VTB },
    { func: getMTBRank, name: CONSTANTS__NAMES_BANKS.MTB },
    // { func: getPriorRank, name: CONSTANTS__NAMES_BANKS.PRIOR },
    { func: getBSBRank, name: CONSTANTS__NAMES_BANKS.BSB },
    { func: getParitetRank, name: CONSTANTS__NAMES_BANKS.PARITET },
    { func: getBelwebRank, name: CONSTANTS__NAMES_BANKS.BELWEB },
    { func: getSberRank, name: CONSTANTS__NAMES_BANKS.SBER },
    { func: getBelGazRank, name: CONSTANTS__NAMES_BANKS.BELGAZPROM },
    { func: getBelInvestRank, name: CONSTANTS__NAMES_BANKS.BELINVEST },
    { func: getBNBRank, name: CONSTANTS__NAMES_BANKS.BNB },
  ];
};
