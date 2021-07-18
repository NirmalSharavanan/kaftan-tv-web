package com.stinsoft.kaftan.controller.wallet;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.hash.Hashing;
import com.stinsoft.kaftan.controller.BaseController;
import com.stinsoft.kaftan.dto.wallet.BankTransferTypeDTO;
import com.stinsoft.kaftan.dto.wallet.EncryptDataDTO;
import com.stinsoft.kaftan.dto.wallet.MobileOperatorsDTO;
import com.stinsoft.kaftan.dto.wallet.ServicesDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;

import com.stinsoft.kaftan.model.wallet.WalletFavorite;
import com.stinsoft.kaftan.model.wallet.WalletOperators;
import com.stinsoft.kaftan.service.wallet.WalletService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import ss.core.helper.CounterHelper;
import ss.core.model.User;
import ss.core.security.service.ISessionService;

@RestController
@RequestMapping("api/")
public class ServicesController extends BaseController {

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private WalletService walletService;

    @Autowired
    CounterHelper counterHelper;

    Logger logger = null;

    @RequestMapping(value = "session/services/registrationEncrypt", method = RequestMethod.POST)
    public ResponseEntity<?> getRegistrationEncrypt(@RequestBody final EncryptDataDTO encryptDataDTO) {
        try {
            User user = sessionService.getUser();

            HashMap encryptedHash = new HashMap();
            String macIng = "";

            if (user != null) {
                if (encryptDataDTO.getBankCode() != null && !encryptDataDTO.getBankCode().isEmpty() &&
                        encryptDataDTO.getIdValue() != null && !encryptDataDTO.getIdValue().isEmpty() &&
                        encryptDataDTO.getMobileNo() != null && !encryptDataDTO.getMobileNo().isEmpty()) {
                    macIng = Hashing.sha256().hashString(encryptDataDTO.getBankCode() + "#" + encryptDataDTO.getIdValue() + "#" + encryptDataDTO.getMobileNo(), StandardCharsets.UTF_8).toString();
                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", true);
                    encryptedHash.put("message", "Success!!");
                } else {
                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", false);
                    encryptedHash.put("message", "Failure!!");
                }
            }
            return new ResponseEntity<>(encryptedHash, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/services/miniStatementEncrypt", method = RequestMethod.POST)
    public ResponseEntity<?> getMiniStatementEncrypt(@RequestBody final EncryptDataDTO encryptDataDTO) {
        try {
            User user = sessionService.getUser();

            HashMap encryptedHash = new HashMap();
            String macIng = "";

            if (user != null) {

                if (encryptDataDTO.getWalletCode() != null && !encryptDataDTO.getWalletCode().isEmpty() &&
                        encryptDataDTO.getRrnNo() != null && !encryptDataDTO.getRrnNo().isEmpty()) {
                    macIng = Hashing.sha256().hashString(encryptDataDTO.getWalletCode() + "#" + encryptDataDTO.getRrnNo(), StandardCharsets.UTF_8).toString();

                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", true);
                    encryptedHash.put("message", "Success!!");
                } else {
                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", false);
                    encryptedHash.put("message", "Failure!!");
                }
            }
            return new ResponseEntity<>(encryptedHash, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/services/creditAndDebitEncrypt", method = RequestMethod.POST)
    public ResponseEntity<?> getCreditAndDebitEncrypt(@RequestBody final EncryptDataDTO encryptDataDTO) {
        try {
            User user = sessionService.getUser();

            HashMap encryptedHash = new HashMap();
            String macIng = "";

            if (user != null) {

                if (encryptDataDTO.getWalletCode() != null && !encryptDataDTO.getWalletCode().isEmpty() &&
                        encryptDataDTO.getRrnNo() != null && !encryptDataDTO.getRrnNo().isEmpty() &&
                        encryptDataDTO.getBankCode() != null && !encryptDataDTO.getBankCode().isEmpty()) {
                    macIng = Hashing.sha256().hashString(encryptDataDTO.getWalletCode() + "#" + encryptDataDTO.getRrnNo() + "#" + encryptDataDTO.getBankCode() + "#" + encryptDataDTO.getAmount(), StandardCharsets.UTF_8).toString();

                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", true);
                    encryptedHash.put("message", "Success!!");
                } else {
                    encryptedHash.put("macing", macIng);
                    encryptedHash.put("Success", false);
                    encryptedHash.put("message", "Failure!!");
                }
            }

            return new ResponseEntity<>(encryptedHash, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}