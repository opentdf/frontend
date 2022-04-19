export const selectors = {
    sectionTab: '.nav-link',
    loginButton: '[data-test-id=login-button]',
    logoutButton: '[data-test-id=logout-button]',
    loginScreen: {
        usernameField: '#username',
        passwordField: '#password',
        submitButton: '#kc-login'
    },
    secondaryHeader: 'h2',
    realmSelector: '#rc_select_0',
    attributesPage: {
        openNewSectionBtn: '.ant-collapse-header',
        newSection: {
            authorityField: '#authority',
            submitAuthorityBtn: '#authority-submit',
            attributeNameField: "#name",
            orderField: '#order_0',
            submitAttributeBtn: '#create-attribute-button',
        }
    },
    entitlementsPage: {
        authorityNamespaceField:'#authority',
        attributeNameField: '#name',
        attributeValueField: '#value',
        submitAttributeButton: "#assign-submit",
        entityDetailsPage: {
            tableCell: '.ant-table-cell',
            tableRow: '.ant-table-row',
            deleteAttributeBtn: '.ant-btn-link',
        }
    },
    alertMessage: '.Toastify__toast-body',
    tokenMessage: '.Toastify__toast'
}