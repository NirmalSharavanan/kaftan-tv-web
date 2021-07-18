import { RestAPI } from './../helper/api.constants';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './../helper/httpService';
import { Injectable } from '@angular/core';
import { WalletOperators } from './../models/WalletOperators';
import { WalletCharges } from './../models/WalletCharges';
import { WalletStockPurchase } from 'app/models/WalletStockPurchase';


@Injectable()
export class WalletService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }

  createOperators(walletOperators: WalletOperators[]) {
    return this.post(RestAPI.POST_WALLET_SERVICE_INIT, walletOperators);
  }

  createOperator(walletOperator: any) {
    return this.post(RestAPI.POST_WALLET_OPERATOR, walletOperator);
  }

  getAllOperators() {
    return this.get(RestAPI.GET_WALLET_SERVICES);
  }

  getOperatorsByService(serviceTypeId: number) {
    return this.get(RestAPI.GET_WALLET_SERVICES + '/' + serviceTypeId);
  }

  updateOperator(walletOperators: WalletOperators, operatorId: string) {
    return this.put(RestAPI.PUT_WALLET_OPERATOR + '/' + operatorId, walletOperators);
  }

  createChargeConfig(charge: WalletCharges) {
    return this.post(RestAPI.POST_CHARGE_CONFIG, charge);
  }

  getAllChargeConfigs() {
    return this.get(RestAPI.GET_ALL_CHARGE_CONFIGS);
  }

  getChargeConfig(chargeId: string) {
    return this.get(RestAPI.GET_CHARGE_CONFIG + '/' + chargeId);
  }

  updateChargeConfig(charge: WalletCharges, chargeId: string) {
    return this.put(RestAPI.PUT_CHARGE_CONFIG + '/' + chargeId, charge);
  }

  createWalletStock(walletStock: WalletStockPurchase) {
    return this.post(RestAPI.POST_WALLET_STOCK_PURCHASE, walletStock);
  }

  registrationEncrypt(regEncryptValue: any) {
    return this.post(RestAPI.REGISTER_MACING, regEncryptValue);
  }

  getSubscriber(keyword: any, isMobile: boolean) {
    return this.get(RestAPI.GET_SUBSCRIBER + '/' + keyword + '/' + isMobile)
  }

  getAllSubscribers() {
    return this.get(RestAPI.GET_ALL_SUBSCRIBERS)
  }

  getAllSubscribersbyMonth() {
    return this.get(RestAPI.GET_ALL_SUBSCRIBERS_BY_MONTH)
  }

  getWalletStocks(operatorId: string, from_date: Date, to_date: Date) {
    return this.get(RestAPI.GET_WALLET_STOCKS + '/' + operatorId + '/' + from_date + '/' + to_date);
  }

  getTransactionReport(serviceType: number, operatorId: string, from_date: Date, to_date: Date) {
    return this.get(RestAPI.GET_TRANSACTION_REPORTS + '/' + serviceType + '/' + operatorId + '/' + from_date + '/' + to_date);
  }

  createThresholdAlerts(operatorId: String, thresholdAlerts: any) {
    return this.post(RestAPI.POST_THRESHOLD_ALERTS + '/' + operatorId, thresholdAlerts);
  }

  getThresholdAlerts(operatorId: string) {
    return this.get(RestAPI.GET_THRESHOLD_ALERTS_BY_OPERATOR + '/' + operatorId);
  }

  getTransactionSummary(from_date: Date, to_date: Date) {
    return this.get(RestAPI.GET_TRANSACTION_SUMMARY  + '/' + from_date + '/' + to_date);
  }

  getAllTransactionReport() {
    return this.get(RestAPI.GET_ALL_TRANSACTION_REPORTS );
  }

  getAllTransactionHistory() {
    return this.get(RestAPI.GET_ALL_TRANSACTION_HISTORY );
  }
}