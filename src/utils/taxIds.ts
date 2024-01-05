const taxIds: Array<{ country: string; enum: string | string[] }> = [
  { country: 'Australia', enum: ['au_abn', 'aur_arn'] },
  // { country: 'Australia', enum: 'au_arn' },
  { country: 'Austria', enum: 'eu_vat' },
  { country: 'Belgium', enum: 'eu_vat' },
  { country: 'Brazil', enum: ['br_cnpj', 'br_cpf'] },
  // { country: 'Brazil', enum: 'br_cpf' },
  { country: 'Bulgaria', enum: ['bg_uic', 'eu_vat'] },
  // { country: 'Bulgaria', enum: 'eu_vat' },
  {
    country: 'Canada',
    enum: ['ca_bn', 'ca_gst_hst', 'ca_pst_bc', 'ca_pst_mb', 'ca_pst_sk', 'ca_qst'],
  },
  // { country: 'Canada', enum: 'ca_gst_hst' },
  // { country: 'Canada', enum: 'ca_pst_bc' },
  // { country: 'Canada', enum: 'ca_pst_mb' },
  // { country: 'Canada', enum: 'ca_pst_sk' },
  // { country: 'Canada', enum: 'ca_qst' },
  { country: 'Chile', enum: 'cl_tin' },
  { country: 'Croatia', enum: 'eu_vat' },
  { country: 'Cyprus', enum: 'eu_vat' },
  { country: 'Czech Republic', enum: 'eu_vat' },
  { country: 'Denmark', enum: 'eu_vat' },
  { country: 'Egypt', enum: 'eg_tin' },
  { country: 'Estonia', enum: 'eu_vat' },
  { country: 'EU', enum: 'eu_oss_vat' },
  { country: 'Finland', enum: 'eu_vat' },
  { country: 'France', enum: 'eu_vat' },
  { country: 'Georgia', enum: 'ge_vat' },
  { country: 'Germany', enum: 'eu_vat' },
  { country: 'Greece', enum: 'eu_vat' },
  { country: 'Hong Kong', enum: 'hk_br' },
  { country: 'Hungary', enum: ['eu_vat', 'hu_tin'] },
  // { country: 'Hungary', enum: 'hu_tin' },
  { country: 'Iceland', enum: 'is_vat' },
  { country: 'India', enum: 'in_gst' },
  { country: 'Indonesia', enum: 'id_npwp' },
  { country: 'Ireland', enum: 'eu_vat' },
  { country: 'Israel', enum: 'il_vat' },
  { country: 'Italy', enum: 'eu_vat' },
  { country: 'Japan', enum: ['jp_cn', 'jpn_rn', 'jpn_trn'] },
  // { country: 'Japan', enum: 'jp_rn' },
  // { country: 'Japan', enum: 'jp_trn' },
  { country: 'Kenya', enum: 'ke_pin' },
  { country: 'Latvia', enum: 'eu_vat' },
  { country: 'Liechtenstein', enum: 'li_uid' },
  { country: 'Lithuania', enum: 'eu_vat' },
  { country: 'Luxembourg', enum: 'eu_vat' },
  { country: 'Malaysia', enum: ['my_frp', 'my_itn', 'my_sst'] },
  // { country: 'Malaysia', enum: 'my_itn' },
  // { country: 'Malaysia', enum: 'my_sst' },
  { country: 'Malta', enum: 'eu_vat' },
  { country: 'Mexico', enum: 'mx_rfc' },
  { country: 'Netherlands', enum: 'eu_vat' },
  { country: 'New Zealand', enum: 'nz_gst' },
  { country: 'Norway', enum: 'no_vat' },
  { country: 'Philippines', enum: 'ph_tin' },
  { country: 'Poland', enum: 'eu_vat' },
  { country: 'Portugal', enum: 'eu_vat' },
  { country: 'Romania', enum: 'eu_vat' },
  { country: 'Russia', enum: ['ru_inn', 'ru_kpp'] },
  // { country: 'Russia', enum: 'ru_kpp' },
  { country: 'Saudi Arabia', enum: 'sa_vat' },
  { country: 'Singapore', enum: ['sg_gst', 'sg_uen'] },
  // { country: 'Singapore', enum: 'sg_uen' },
  { country: 'Slovakia', enum: 'eu_vat' },
  { country: 'Slovenia', enum: ['eu_vat', 'si_tin'] },
  // { country: 'Slovenia', enum: 'si_tin' },
  { country: 'South Africa', enum: 'za_vat' },
  { country: 'South Korea', enum: 'kr_brn' },
  { country: 'Spain', enum: ['es_cif', 'eu_vat'] },
  { country: 'Sweden', enum: 'eu_vat' },
  { country: 'Switzerland', enum: 'ch_vat' },
  { country: 'Taiwan', enum: 'tw_vat' },
  { country: 'Thailand', enum: 'th_vat' },
  { country: 'Turkey', enum: 'tr_tin' },
  { country: 'Ukraine', enum: 'ua_vat' },
  { country: 'United Arab Emirates', enum: 'ae_trn' },
  { country: 'United Kingdom', enum: ['eu_vat', 'gb_vat'] },
  // { country: 'United Kingdom', enum: 'gb_vat' },
  { country: 'United States', enum: 'us_ein' },
]

export default taxIds