export const BASIC_ADMIN = [
  {text: 'Основное', exact: true, to: '/admin/'}
]

export const ADMIN_COMPANIES = [
  ...BASIC_ADMIN,
  {text: 'Компании', exact: true, to: '/admin/companies'}
]

export const ADMIN_COMPANIES_CREATE = [
  ...BASIC_ADMIN,
  {text: 'Компании', exact: true, to: '/admin/companies'},
  {text: 'Создание', to: '/admin/companies/create'}
]

export const ADMIN_COMPANIES_REPORTS_CREATE = [
  ...BASIC_ADMIN,
  {text: 'Компании', to: '/admin/companies'},
]

export const ADMIN_USERS = [
  ...BASIC_ADMIN,
  {text: 'Пользователи', to: '/admin/users'}
]

export const ADMIN_PERIODS = [
  ...BASIC_ADMIN,
  {text: 'Периоды', to: '/admin/periods'}
]

export const ADMIN_TYPES_REPORTS = [
  ...BASIC_ADMIN,
  {text: 'Типы отчетов', to: '/admin/typesreports'}
]

export const ADMIN_GROUPS_PARAMETERS = [
  ...BASIC_ADMIN,
  {text: 'Группы параметров', to: '/admin/groupsparameters'},
]

export const ADMIN_PARAMETERS = [
  ...BASIC_ADMIN,
  {text: 'Параметры', to: '/admin/parameters'},
]

export const ADMIN_SETTINGS_REPORTS = [
  ...BASIC_ADMIN,
  {text: 'Настройки отчетов', exact: true, to: '/admin/settingsreports'},
]

export const ADMIN_SETTINGS_REPORTS_CREATE = [
  ...BASIC_ADMIN,
  {text: 'Настройки отчетов', exact: true, to: '/admin/settingsreports'},
  {text: 'Создание', to: '/admin/settingsreports/create'}
]
