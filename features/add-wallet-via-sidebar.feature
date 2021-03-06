@skip
Feature: Add Wallet via Sidebar

  Background:
    Given I have a wallet

  Scenario: Successfully Adding a Wallet
    Given The sidebar shows the wallets category
    When I click on the add wallet button in the sidebar
    And I see the create wallet dialog
    And I submit the create wallet dialog with the following inputs:
    | walletName |
    | Test       |
    Then I should be on the Test wallet summary screen
    And I dont see the create wallet dialog anymore
