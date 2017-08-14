

const masters = {
  actions: [
    { key: 'LOADING', value: 'LOADING', text: 'LOADING' },
    { key: 'UNLOADING', value: 'UNLOADING', text: 'UNLOADING' }
  ],
  regions: [
    { key: 'WITH_IN_STATE', value: 'WITH_IN_STATE', text: 'WITH IN STATE' },
    { key: 'OUTSIDE_STATE', value: 'OUTSIDE_STATE', text: 'OUTSIDE STATE' }
  ],
  products: [
    { key: 'RICE', value: 'RICE', text: 'RICE' },
    { key: 'PADDY', value: 'PADDY', text: 'PADDY' },
    { key: 'BROKEN', value: 'BROKEN', text: 'BROKEN' }
  ],
  lorryTypes: [
    { key: '6_TYRE', value: '6_TYRE', text: '6 TYRE' },
    { key: '10_TYRE', value: '10_TYRE', text: '10 TYRE' },
    { key: '12_TYRE', value: '12_TYRE', text: '12 TYRE' },
    { key: '14_TYRE', value: '14_TYRE', text: '14 TYRE' }
  ],
  jattus: [
    { key: 'V.VEERABABU', value: 'V.VEERABABU', text: 'V.VEERABABU' },
    { key: 'P.SRINU', value: 'P.SRINU', text: 'P.SRINU' },
    { key: 'E.TAMMAYYA', value: 'E.TAMMAYYA', text: 'E.TAMMAYYA' },
    { key: 'P.YESU', value: 'P.YESU', text: 'P.YESU' },
    { key: 'B.GANGARAM', value: 'B.GANGARAM', text: 'B.GANGARAM' },
    { key: 'B.RAMBABU', value: 'B.RAMBABU', text: 'B.RAMBABU' },
  ]
};

export function getMasters(masterType) {
  return masters[masterType] || [];
}
