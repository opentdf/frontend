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

        }
    },
    entitlementsPage: {
        authorityNamespaceField:'#authority',
        attributeNameField: '#name',
        attributeValueField: '#value',
        submitAttributeButton: "#assign-submit"
    }
}