// @flow
import { observable, action, computed } from 'mobx';
import Store from './lib/Store';

export type walletBackupSteps = 'privacyWarning' | 'recoveryPhraseDisplay' | 'recoveryPhraseEntry' | null;

export default class WalletBackupStore extends Store {

  @observable inProgress = false;
  @observable currentStep: walletBackupSteps = null;
  @observable recoveryPhrase = [];
  @observable recoveryPhraseWords = [];
  @observable recoveryPhraseShuffled = [];
  @observable completed = false;
  @observable enteredPhrase = [];
  @observable isPrivacyNoticeAccepted = false;
  @observable isEntering = false;
  @observable isTermDeviceAccepted = false;
  @observable isTermRecoveryAccepted = false;
  @observable countdownRemaining = 0;

  countdownTimer: ?number = null;

  setup() {
    const a = this.actions.walletBackup;
    a.initiateWalletBackup.listen(this._initiateWalletBackup);
    a.acceptPrivacyNoticeForWalletBackup.listen(this._acceptPrivacyNoticeForWalletBackup);
    a.continueToRecoveryPhraseForWalletBackup.listen(this._continueToRecoveryPhraseForWalletBackup);
    a.startWalletBackup.listen(this._startWalletBackup);
    a.addWordToWalletBackupVerification.listen(this._addWordToWalletBackupVerification);
    a.clearEnteredRecoveryPhrase.listen(this._clearEnteredRecoveryPhrase);
    a.acceptWalletBackupTermDevice.listen(this._acceptWalletBackupTermDevice);
    a.acceptWalletBackupTermRecovery.listen(this._acceptWalletBackupTermRecovery);
    a.restartWalletBackup.listen(this._restartWalletBackup);
    a.cancelWalletBackup.listen(this._cancelWalletBackup);
    a.finishWalletBackup.listen(this._finishWalletBackup);
  }

  @action _initiateWalletBackup = (params: { recoveryPhrase: Array<string> }) => {
    this.recoveryPhrase = params.recoveryPhrase;
    this.actions.wallets.toggleCreateWalletDialog();
    this.inProgress = true;
    this.currentStep = 'privacyWarning';
    this.recoveryPhraseWords = this.recoveryPhrase.map(word => ({ word }));
    this.recoveryPhraseShuffled = this.recoveryPhrase
      .sort(() => 0.5 - Math.random())
      .map(w => ({ word: w, isActive: true }));
    this.completed = false;
    this.enteredPhrase = [];
    this.isPrivacyNoticeAccepted = false;
    this.isEntering = false;
    this.isTermDeviceAccepted = false;
    this.isTermRecoveryAccepted = false;
    this.countdownRemaining = 10;
    this.countdownTimer = null;
    this.countdownTimer = setInterval(() => {
      if (this.countdownRemaining > 0) {
        action(() => this.countdownRemaining--)();
      } else if (this.countdownTimer != null) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  };

  @action _acceptPrivacyNoticeForWalletBackup = () => {
    this.isPrivacyNoticeAccepted = true;
  };

  @action _continueToRecoveryPhraseForWalletBackup = () => {
    this.currentStep = 'recoveryPhraseDisplay';
  };

  @action _startWalletBackup = () => {
    this.currentStep = 'recoveryPhraseEntry';
  };

  @action _addWordToWalletBackupVerification = (params: { word: string }) => {
    const { word } = params;
    this.enteredPhrase.push({ word });
    const pickedWord = this.recoveryPhraseShuffled.find(w => w.word === word);
    if (pickedWord) pickedWord.isActive = false;
  };

  @action _clearEnteredRecoveryPhrase = () => {
    this.enteredPhrase = [];
    this.recoveryPhraseShuffled = this.recoveryPhraseShuffled.map(
      ({ word }) => ({ word, isActive: true })
    );
  };

  @computed get isRecoveryPhraseValid(): bool {
    return (
      this.recoveryPhraseWords.reduce((words, { word }) => words + word, '') ===
      this.enteredPhrase.reduce((words, { word }) => words + word, '')
    );
  }

  @action _acceptWalletBackupTermDevice = () => {
    this.isTermDeviceAccepted = true;
  };

  @action _acceptWalletBackupTermRecovery = () => {
    this.isTermRecoveryAccepted = true;
  };

  @action _restartWalletBackup = () => {
    this._clearEnteredRecoveryPhrase();
    this.currentStep = 'recoveryPhraseDisplay';
  };

  @action _cancelWalletBackup = () => {
    this.inProgress = false;
    this._clearEnteredRecoveryPhrase();
  };

  @action _finishWalletBackup = async () => {
    this.inProgress = false;
  }

}
