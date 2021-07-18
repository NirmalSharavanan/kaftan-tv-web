package com.stinsoft.kaftan.service.wallet;

import com.stinsoft.kaftan.dto.wallet.ServicesDTO;
import com.stinsoft.kaftan.model.wallet.WalletOperators;
import org.bson.types.ObjectId;

import java.util.List;

public interface IWalletService {
    WalletOperators create(WalletOperators walletService);
    List<WalletOperators> findAll();
    List<WalletOperators> findOperatorsByService(int serviceTypeId);
    WalletOperators find(ObjectId Id);
    WalletOperators find(String Id);
    //walletServices findDeviceByName(ObjectId customerId, String deviceName);
    WalletOperators update(ObjectId id, WalletOperators walletOperator);

    WalletOperators findServiceByName(String name, String operatorCode);
    WalletOperators findBillerOperator(String name, Integer categoryCode, String operatorCode);
    List<ServicesDTO> findAllOperators();

}
