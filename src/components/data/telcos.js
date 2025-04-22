export const telcoPrefixes = {
  Nigeria: {
    MTN: ['07025', '07026', '0703', '0704', '0706', '0707', '0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0916'],
    Airtel: ['0701', '0708', '0802', '0808', '0812', '0901', '0902', '0904', '0907', '0911', '0912'],
    Glo: ['0705', '0805', '0807', '0811', '0815', '0905', '0915'],
    '9Mobile': ['0809', '0817', '0818', '0908', '0909', '0901'], // Note: 0901 also listed under Airtel
    Note: 'Mobile number portability (MNP) was introduced in Nigeria in 2013, so prefixes may not reflect the current network provider.'
  },
  Kenya: {
    Safaricom: ['0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709', '0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719', '0720', '0721', '0722', '0723', '0724', '0725', '0726', '0727', '0728', '0729', '0740', '0741', '0742', '0743', '0744', '0745', '0746', '0748', '0757', '0758', '0759', '0768', '0769', '0790', '0791', '0792', '0793', '0794', '0795', '0796', '0797', '0798', '0799', '0110', '0111', '0112', '0113', '0114', '0115', '0100', '0101', '0102', '0103', '0104', '0105'],
    Airtel: ['0730', '0731', '0732', '0733', '0734', '0735', '0736', '0737', '0738', '0739', '0750', '0751', '0752', '0753', '0754', '0755', '0756', '0785', '0786', '0787', '0788', '0789', '0106', '0107', '0108', '0109', '0116', '0117', '0118', '0119'],
    Telkom: ['0770', '0771', '0772', '0773', '0774', '0775', '0776', '0777', '0778', '0779', '0120', '0121', '0122', '0123', '0124', '0125', '0126', '0127', '0128', '0129'],
    Note: 'Mobile number portability (MNP) is supported in Kenya, so prefixes may not reflect the current network provider.'
  },
  Ghana: {
    MTN: ['024', '054', '055', '057', '059'],
    Vodafone: ['020', '030', '050', '056'],
    AirtelTigo: ['026', '027', '057', '055'], // Note: Overlaps with MTN on 055, 057
    Note: 'Mobile number portability (MNP) is supported in Ghana, so prefixes may not reflect the current network provider.'
  },
  USA: {
    Note: 'The USA uses the North American Numbering Plan (NANP) with country code +1. Mobile numbers share area codes with landlines, and prefixes are not carrier-specific due to mobile number portability since 2003. Carrier detection may require a third-party API.'
  },
  UK: {
    EE: ['0740', '0741', '0742', '0743', '0744', '0745', '0746', '0747', '0748', '0749', '0750', '0751', '0752', '0753', '0754', '0755', '0756', '0757', '0758', '0759', '0770', '0771', '0772', '0773', '0774', '0775', '0776', '0777', '0778', '0779', '0780', '0781', '0782', '0783', '0784', '0785', '0786', '0787', '0788', '0789', '0790', '0791', '0792', '0793', '0794', '0795', '0796', '0797', '0798', '0799'],
    O2: ['0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709', '0760', '0761', '0762', '0763', '0764', '0765', '0766', '0767', '0768', '0769', '0770', '0771', '0772', '0773', '0774', '0775', '0776', '0777', '0778', '0779', '0780', '0781', '0782', '0783', '0784', '0785', '0786', '0787', '0788', '0789'],
    Vodafone: ['0720', '0721', '0722', '0723', '0724', '0725', '0726', '0727', '0728', '0729', '0730', '0731', '0732', '0733', '0734', '0735', '0736', '0737', '0738', '0739', '0770', '0771', '0772', '0773', '0774', '0775', '0776', '0777', '0778', '0779', '0780', '0781', '0782', '0783', '0784', '0785', '0786', '0787', '0788', '0789'],
    Three: ['0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719', '0740', '0741', '0742', '0743', '0744', '0745', '0746', '0747', '0748', '0749', '0750', '0751', '0752', '0753', '0754', '0755', '0756', '0757', '0758', '0759'],
    Note: 'Mobile number portability (MNP) has been supported in the UK since 1999, so prefixes may not reflect the current network provider.'
  },
  SouthAfrica: {
    MTN: ['083', '060', '076', '078', '079'],
    Vodacom: ['082', '071', '072', '074', '076'], // Note: Overlap with MTN on 076
    CellC: ['084', '061', '062'],
    Telkom: ['081', '073'],
    Note: 'Mobile number portability (MNP) is likely supported in South Africa, so prefixes may not reflect the current network provider.'
  },
  Uganda: {
    Airtel: ['075', '070'],
    MTN: ['077', '078'],
    Orange: ['079'], // Note: Orange may have exited or rebranded
    Note: 'Mobile number portability (MNP) is likely supported in Uganda, so prefixes may not reflect the current network provider.'
  },
  Zambia: {
    MTN: ['076', '096'],
    Airtel: ['077', '097'],
    Zamtel: ['095'], // Note: Zamtel also uses 0211-0218, but formatted as 095 for consistency
    Note: 'Mobile number portability (MNP) is likely supported in Zambia, so prefixes may not reflect the current network provider.'
  },
  Tanzania: {
    Vodacom: ['074', '075', '076'],
    Yas: ['065', '067', '071','077'], // Includes Zantel due to merger
    Airtel: ['068', '069', '078'],
    Halotel: ['062','061'], // Inferred; not directly listed in provided data
    Note: 'Mobile number portability (MNP) is likely supported in Tanzania, so prefixes may not reflect the current network provider.'
  }
};

export default telcoPrefixes;
