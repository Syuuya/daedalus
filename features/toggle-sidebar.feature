@skip
Feature: Toggle Sidebar

  Background:
    Given I have a wallet

  Scenario: Hide Sidebar
    Given the sidebar is visible
    When I click on the sidebar toggle button
    Then the sidebar should be hidden

  Scenario: Show Sidebar
    Given the sidebar is hidden
    When I click on the sidebar toggle button
    Then the sidebar should be visible
