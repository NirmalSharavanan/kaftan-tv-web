package com.stinsoft.kaftan.controller.wallet;


import com.google.common.hash.Hashing;
import com.stinsoft.kaftan.controller.BaseController;
import com.stinsoft.kaftan.controller.SubscriptionController;
import com.stinsoft.kaftan.controller.payment.EBSPaymentController;
import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.dto.wallet.*;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.UserSubscription;
import com.stinsoft.kaftan.model.wallet.*;
import com.stinsoft.kaftan.service.UserSubscriptionService;
import com.stinsoft.kaftan.service.wallet.WalletService;
import com.stinsoft.kaftan.service.wallet.WalletUserService;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import ss.core.aws.S3Service;
import ss.core.helper.CounterHelper;
import ss.core.helper.DateHelper;
import ss.core.messages.CommonErrorMessages;
import ss.core.model.Customer;
import ss.core.model.User;
import ss.core.security.service.ISessionService;
import ss.core.service.BasicUserService;

import javax.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import ss.core.service.CustomerService;

@RestController
@RequestMapping("api/")
public class WalletController extends BaseController{
    @Autowired
    private ISessionService sessionService;

    @Autowired
    WalletUserService walletUserService;

    @Autowired
    private WalletService walletService;

    @Autowired
    S3Service s3Service;

    @Autowired
    CounterHelper counterHelper;

    @Autowired
    BasicUserService userService;

    @Autowired
    CustomerService customerService;

    @Autowired
    private SubscriptionController subscriptionController;

    @Autowired
    private EBSPaymentController ebsPaymentController;

    @Autowired
    private UserSubscriptionService userSubscriptionService;

    final String secretKey = "KAFTON";

    Logger logger = null;

    @RequestMapping(value = "session/user/wallet/create", method = RequestMethod.POST)
    public ResponseEntity<?> createWallet(@RequestBody final WalletDTO walletDTO) {
        try {
            User user = sessionService.getUser();
            WalletUser walletUser = null;
            if (user != null) {
                walletUser = walletUserService.findByWalletCode(user.getId());
                if (walletUser == null) {
                    walletUser = new WalletUser();
                    walletUser.setUser_id(sessionService.getUser().getId());
                    walletUser.setAddress(walletDTO.getAddress());
                    walletUser.setIdType(walletDTO.getIdType());
                    walletUser.setIdValue(walletDTO.getIdValue());

                    walletUser.setWalletCode(walletDTO.getWalletCode());
                    walletUser.setRrnNo(walletDTO.getRrnNo());
                    walletUser.setBankCode(walletDTO.getBankCode());
                    walletUser.setBalance(walletDTO.getBalance());
                    walletUser.setActive(true);
                    walletUser.setHasAutoSubscription(false);

                    walletUser = walletUserService.create(walletUser);
                    if (walletUser != null) {
                        walletUser.setSuccess(true);
                        walletUser.setMessage(AppMessages.WALLET_USER_CREATED);
                    } else {
                        walletUser = new WalletUser();
                        walletUser.setSuccess(false);
                        walletUser.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/createPin/{walletId}/{txnPin}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateWalletPin(@PathVariable String walletId, @PathVariable String txnPin) {
        try {
            User user = sessionService.getUser();
            WalletUser walletUser = null;
            if(user != null) {
                walletUser = walletUserService.findWalletByUserId(user.getId());
                if (walletUser != null) {
                    walletUser.setTransactionPin(txnPin);
                    walletUser = walletUserService.update(new ObjectId(walletId), walletUser);
                    if (walletUser != null) {
                        walletUser.setSuccess(true);
                        walletUser.setMessage(AppMessages.WALLET_PIN_UPDATED);
                    } else {
                        walletUser = new WalletUser();
                        walletUser.setSuccess(false);
                        walletUser.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/update/{walletId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateWallet(@PathVariable String walletId, @RequestBody final WalletDTO walletDTO) {
        try {
            User user = sessionService.getUser();
            WalletUser walletUser = null;
            if (user != null) {
                walletUser = walletUserService.find(walletId);
                if (walletUser != null) {
                    walletUser.setBalance(walletDTO.getBalance());
                    walletUser = walletUserService.update(new ObjectId(walletId), walletUser);
                    if (walletUser != null) {
                        walletUser.setSuccess(true);
                        walletUser.setMessage(AppMessages.WALLET_UPDATED);
                    } else {
                        walletUser = new WalletUser();
                        walletUser.setSuccess(false);
                        walletUser.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/wallet/{walletId}", method = RequestMethod.GET)
    public ResponseEntity<?> getWallet(@PathVariable String walletId) {
        try {

            User user = sessionService.getUser();
            WalletUser walletUser = null;
            if (user != null) {
                walletUser = walletUserService.find(walletId);
                if (walletUser != null) {
                    walletUser.setSuccess(true);
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet", method = RequestMethod.GET)
    public ResponseEntity<?> getWalletbyUser() {
        try {

            User user = sessionService.getUser();
            List<WalletDTO> walletUsers = new ArrayList<>();
            WalletDTO walletuser = new WalletDTO();

            if (user != null) {
                walletUsers = walletUserService.findWalletByUser(user.getId());
                if (walletUsers != null && walletUsers.size() > 0) {
                    walletUsers.get(0).setSuccess(true);
                    walletuser = walletUsers.get(0);
                } else {
                    walletuser.setSuccess(false);
                }
            }
            return new ResponseEntity<>(walletuser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/{mobileNo}", method = RequestMethod.GET)
    public ResponseEntity<?> getWalletbyUser(@PathVariable String mobileNo) {
        try {

            User user = sessionService.getUser();

            WalletUser walletUser = null;
            if (user != null) {
                walletUser = walletUserService.findWalletByMobileNo(mobileNo);
                if (walletUser != null) {
                    walletUser.setSuccess(true);
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "wallets", method = RequestMethod.GET)
    public ResponseEntity<?> getAllWallets() {
        try {

            List<WalletUser> walletUser = walletUserService.findAll();

            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/delete/{walletId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteWallet(@PathVariable String walletId) {
        try {
            User user = sessionService.getUser();
            WalletUser walletUser = null;
            if (user != null) {
                walletUser = walletUserService.find(walletId);
                if (walletUser != null) {
                    walletUserService.delete(walletUser.getId());
                    walletUser.setSuccess(true);
                    walletUser.setMessage(AppMessages.WALLET_DELETED);
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/favorite/create", method = RequestMethod.POST)
    public ResponseEntity<?> createFavorite(@RequestBody final WalletFavoriteDTO favoriteDTO) {
        try {
            User user = sessionService.getUser();
            WalletFavorite favorite = null;
            if (user != null && favoriteDTO.getOperatorId() != null) {
                WalletOperators operator = walletService.find(favoriteDTO.getOperatorId());
                if (operator != null) {
                    if (operator.getName().equals("Mobile Recharge")) {
                        favorite = walletUserService.findFavoriteByMobileRecharge(user.getId(), operator.getId(), favoriteDTO.getMobileNo());
                    }

                    if (operator.getName().equals("Bill Payment")) {
                        favorite = walletUserService.findFavoriteByBillPayment(user.getId(), operator.getId(), favoriteDTO.getAccountId());
                    }

                    if (operator.getName().equals("Money Transfer")) {
                        if (favoriteDTO.getAccountType().equals("Kaftan Customer")) {
                            favorite = walletUserService.findFavoriteByReceiverId(user.getId(), favoriteDTO.getReceiverUserId());
                        }
                        if (favoriteDTO.getAccountType().equals("Bank Account")) {
                            favorite = walletUserService.findFavoriteByBankAc(user.getId(), favoriteDTO.getBankAccountNo(), favoriteDTO.getBankAccountName());
                        }
                    }

                    if (favorite == null) {
                        favorite = new WalletFavorite();
                        favorite.setUserId(sessionService.getUser().getId());
                        favorite.setOperatorId(operator.getId());
                        favorite.setMobileCode(favoriteDTO.getMobileCode());
                        favorite.setMobileNo(favoriteDTO.getMobileNo());
                        favorite.setAccountId(favoriteDTO.getAccountId());
                        favorite.setReceiverUserId(favoriteDTO.getReceiverUserId());
                        favorite.setBankAccountNo(favoriteDTO.getBankAccountNo());
                        favorite.setBankAccountName(favoriteDTO.getBankAccountName());
                        favorite.setActive(true);
                        favorite = walletUserService.createFavorite(favorite);
                        if (favorite != null) {
                            favorite.setSuccess(true);
                            favorite.setMessage(AppMessages.WALLET_FAVORITE_CREATED);
                        } else {
                            favorite = new WalletFavorite();
                            favorite.setSuccess(false);
                            favorite.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                        }
                    }
                    else {
                        favorite = new WalletFavorite();
                        favorite.setSuccess(false);
                        favorite.setMessage(AppMessages.WALLET_FAVORITE_EXISTS);
                    }
                }
            }
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/favorite/update/{favoriteId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateFavorite(@PathVariable String favoriteId,
                                            @RequestBody final WalletFavoriteDTO WalletFavoriteDTO) {
        try {

            User user = sessionService.getUser();
            WalletFavorite favorite = walletUserService.findFavorite(favoriteId);

            if (favorite != null) {
                WalletOperators operator = walletService.find(WalletFavoriteDTO.getOperatorId());
                WalletFavorite existsFavorite = null;
                if (operator != null) {
                    if (operator.getName().equals("Mobile Recharge")) {
                        existsFavorite = walletUserService.findFavoriteByMobileRecharge(user.getId(), operator.getId(), WalletFavoriteDTO.getMobileNo());
                    }

                    if (operator.getName().equals("Bill Payment")) {
                        if(!favorite.getOperatorId().equals(operator.getId())) {
                            existsFavorite = walletUserService.findFavoriteByBillPayment(user.getId(), operator.getId(), WalletFavoriteDTO.getAccountId());
                        }
                    }

                    if (operator.getName().equals("Money Transfer")) {
                        if (WalletFavoriteDTO.getAccountType().equals("Kaftan Customer")) {
                            existsFavorite = walletUserService.findFavoriteByReceiverId(user.getId(), WalletFavoriteDTO.getReceiverUserId());
                        }
                        if (WalletFavoriteDTO.getAccountType().equals("Bank Account")) {
                            existsFavorite = walletUserService.findFavoriteByBankAc(user.getId(), WalletFavoriteDTO.getBankAccountNo(), WalletFavoriteDTO.getBankAccountName());
                        }
                    }
                    if (existsFavorite == null) {
                        favorite.setUserId(sessionService.getUser().getId());
                        favorite.setOperatorId(new ObjectId(WalletFavoriteDTO.getOperatorId()));
                        favorite.setMobileCode(WalletFavoriteDTO.getMobileCode());
                        favorite.setMobileNo(WalletFavoriteDTO.getMobileNo());
                        favorite.setAccountId(WalletFavoriteDTO.getAccountId());
                        favorite.setReceiverUserId(WalletFavoriteDTO.getReceiverUserId());
                        favorite.setBankAccountNo(WalletFavoriteDTO.getBankAccountNo());
                        favorite.setBankAccountName(WalletFavoriteDTO.getBankAccountName());
                        favorite.setActive(true);
                        favorite = walletUserService.updateFavorite(new ObjectId(favoriteId), favorite);
                        if (favorite != null) {
                            favorite.setSuccess(true);
                            favorite.setMessage(AppMessages.WALLET_FAVORITE_UPDATED);
                        } else {
                            favorite = new WalletFavorite();
                            favorite.setSuccess(false);
                            favorite.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                        }
                    } else {
                        favorite = new WalletFavorite();
                        favorite.setSuccess(false);
                        favorite.setMessage(AppMessages.WALLET_FAVORITE_EXISTS);
                    }
                }
            } else {
                favorite = new WalletFavorite();
                favorite.setSuccess(false);
                favorite.setMessage(AppMessages.WALLET_FAVORITE_EXISTS);
            }
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/wallet/favorite/{favoriteId}", method = RequestMethod.GET)
    public ResponseEntity<?> getFavorite(@PathVariable String favoriteId) {
        try {

            User user = sessionService.getUser();
            WalletFavorite favorite = null;
            if (user != null) {
                favorite = walletUserService.findFavorite(favoriteId);
                if (favorite != null) {
                    favorite.setSuccess(true);
                } else {
                    favorite = new WalletFavorite();
                    favorite.setSuccess(false);
                    favorite.setMessage(AppMessages.WALLET_FAVORITE_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/favorites", method = RequestMethod.GET)
    public ResponseEntity<?> getAllFavoritesByUser() {
        try {

            User user = sessionService.getUser();
            List<WalletFavoriteDTO> favorites = new ArrayList<>();

            if (user != null) {
                favorites = walletUserService.findAllFavoritesByUser(user.getId());
            }
            return new ResponseEntity<>(favorites, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/favorite/delete/{favoriteId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteFavorite(@PathVariable String favoriteId) {
        try {

            User user = sessionService.getUser();
            WalletFavorite favorite = null;
            if (user != null) {
                favorite = walletUserService.findFavorite(favoriteId);
                if (favorite != null) {
                    walletUserService.deleteFavorite(favorite.getId());
                    favorite.setSuccess(true);
                    favorite.setMessage(AppMessages.WALLET_FAVORITE_DELETED);
                } else {
                    favorite = new WalletFavorite();
                    favorite.setSuccess(false);
                    favorite.setMessage(AppMessages.WALLET_FAVORITE_NOT_EXISTS);
                }
            }
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/history/create", method = RequestMethod.POST)
    public ResponseEntity<?> createTransactionHistory(@RequestBody final WalletTransactionHistoryDTO walletTransactionHistoryDTO) {
        try {
            User user = sessionService.getUser();
            WalletTransactionHistory walletTransactionHistory = null;
            if (user != null && walletTransactionHistoryDTO.getTransactionType() != null) {

                walletTransactionHistory = new WalletTransactionHistory();
                walletTransactionHistory.setTransactionType(walletTransactionHistoryDTO.getTransactionType());
                walletTransactionHistory.setTxnId(walletTransactionHistoryDTO.getTxnId());
                walletTransactionHistory.setTotalAmount(walletTransactionHistoryDTO.getTotalAmount());
                walletTransactionHistory.setChargeAmount(walletTransactionHistoryDTO.getChargeAmount());
                walletTransactionHistory.setPaymentAmount(walletTransactionHistoryDTO.getPaymentAmount());

                if(walletTransactionHistoryDTO.getOperatorBillerId() != null && !walletTransactionHistoryDTO.getOperatorBillerId().isEmpty())
                    walletTransactionHistory.setOperatorBillerId(new ObjectId(walletTransactionHistoryDTO.getOperatorBillerId()));

                walletTransactionHistory.setTxnMobileNumber(walletTransactionHistoryDTO.getTxnMobileNumber());
                walletTransactionHistory.setCustomerId(walletTransactionHistoryDTO.getCustomerId());
                walletTransactionHistory.setBillerAccountId(walletTransactionHistoryDTO.getBillerAccountId());
                walletTransactionHistory.setMoneyTransferType(walletTransactionHistoryDTO.getMoneyTransferType());
                walletTransactionHistory.setCommission(walletTransactionHistoryDTO.getCommission());

                if(walletTransactionHistoryDTO.getTxnUserId() != null && !walletTransactionHistoryDTO.getTxnUserId().isEmpty())
                    walletTransactionHistory.setTxnUserId(new ObjectId(walletTransactionHistoryDTO.getTxnUserId()));

                walletTransactionHistory.setMoneyTransfer_accountNumber(walletTransactionHistoryDTO.getMoneyTransfer_accountNumber());
                walletTransactionHistory.setMoneyTransfer_accountType(walletTransactionHistoryDTO.getMoneyTransfer_accountType());
                walletTransactionHistory.setMoneyTransfer_bankName(walletTransactionHistoryDTO.getMoneyTransfer_bankName());
                walletTransactionHistory.setTransactionStatus(walletTransactionHistoryDTO.getTransactionStatus());
                walletTransactionHistory.setUserId(sessionService.getUser().getId());
                walletTransactionHistory.setActive(true);

                walletTransactionHistory = walletUserService.createHistory(walletTransactionHistory);
                if (walletTransactionHistory != null) {
                    walletTransactionHistory.setSuccess(true);
                    walletTransactionHistory.setMessage(AppMessages.WALLET_HISTORY_CREATED);
                } else {
                    walletTransactionHistory = new WalletTransactionHistory();
                    walletTransactionHistory.setSuccess(false);
                    walletTransactionHistory.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            }
            return new ResponseEntity<>(walletTransactionHistory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/transactionHistory/{from_date}/{to_date}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllHistoryByUser(@PathVariable String from_date, @PathVariable String to_date) {
        try {

            User user = sessionService.getUser();
            List<WalletTransactionHistoryDTO> walletTransactionHistories = new ArrayList<>();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
            Date fromDate = dateFormat.parse(from_date);
            Date toDate = dateFormat.parse(to_date);

            if (user != null) {
                walletTransactionHistories = walletUserService.findAllHistoryByUser(user.getId(), fromDate, toDate);
            }

            return new ResponseEntity<>(walletTransactionHistories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/history/{historyId}", method = RequestMethod.GET)
    public ResponseEntity<?> getHistoryById(@PathVariable String historyId) {
        try {

            User user = sessionService.getUser();
            List<WalletTransactionHistoryDTO> walletTransactionHistory = null;
            if (user != null) {
                walletTransactionHistory = walletUserService.findTransactionHistory(new ObjectId(historyId));
            }
            return new ResponseEntity<>(walletTransactionHistory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/user/wallet/stock/create", method = RequestMethod.POST)
    public ResponseEntity<?> createWalletStock(@RequestBody final WalletStockPurchaseDTO stockPurchaseDTO) {
        try {
            User user = sessionService.getUser();
            WalletStockPurchase stockPurchase = null;
            List<WalletStockPurchaseDTO> walletStocks = null;
            String responseCode="";
            String walletCode="";

            if (user != null) {
                walletStocks = walletUserService.findWalletStockByOperator(new ObjectId(stockPurchaseDTO.getOperatorId()));

                if (walletStocks != null && walletStocks.size() > 0) {
                    stockPurchase = CreditWallet(stockPurchaseDTO, walletStocks.get(0).getWalletCode());

                } else {
                    JSONObject register = new JSONObject();
                    // Call wallet registration api
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    register.put("bankId", "KAFTON");
                    register.put("name", stockPurchaseDTO.getOperatorName());
                    register.put("mobileCode", "234");
                    register.put("mobile", "9068989149");
                    register.put("address", "252A Abuja");
                    register.put("idType", "PAN");
                    register.put("idValue", "GSM123456");
                    register.put("macing", stockPurchaseDTO.getRegisterMacing());

                    String walletRegistrationAPI = "http://5.32.59.231:4501/wallet/register";

                    RestTemplate restTemplate = new RestTemplate();
                    HttpEntity<String> request =
                            new HttpEntity<String>(register.toString(), headers);

                    String walletRegistrationStr = restTemplate.postForObject(walletRegistrationAPI, request, String.class);
                    JSONObject registerJson = new JSONObject(walletRegistrationStr);
                    responseCode = (String) registerJson.get("responseCode");
                    walletCode = (String) registerJson.get("walletCode");
                    if (responseCode.equals("00") && walletCode != "") {
                        stockPurchase = CreditWallet(stockPurchaseDTO, walletCode);
                    }
                }

            }
            return new ResponseEntity<>(stockPurchase, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    public WalletStockPurchase CreditWallet(WalletStockPurchaseDTO stockPurchaseDTO, String walletCode) {
        try {
            EncryptDataDTO encryptDataDTO = new EncryptDataDTO();
            String macIng = "";
            WalletStockPurchase stockPurchase = null;

            String rrnNo = walletCode.substring(6);
            encryptDataDTO.setWalletCode(walletCode);
            encryptDataDTO.setBankCode("KAFTON");
            encryptDataDTO.setAmount(stockPurchaseDTO.getPurchaseAmount());
            // get credit macing
            macIng = Hashing.sha256().hashString(encryptDataDTO.getWalletCode() + "#" + rrnNo + "#" + encryptDataDTO.getBankCode() + "#" + encryptDataDTO.getAmount(), StandardCharsets.UTF_8).toString();

            if (macIng != null && !macIng.isEmpty()) {

                JSONObject credit = new JSONObject();
                // call wallet credit api
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                credit.put("walletCode", encryptDataDTO.getWalletCode());
                credit.put("rrnNo", rrnNo);
                credit.put("bankCode", encryptDataDTO.getBankCode());
                credit.put("amount", encryptDataDTO.getAmount());
                credit.put("macing", macIng);
                credit.put("remark", "OK");

                String walletCreditAPI = "http://5.32.59.231:4501/wallet/credit";

                RestTemplate restTemplate = new RestTemplate();

                HttpEntity<String> request =
                        new HttpEntity<String>(credit.toString(), headers);

                String walletCreditStr = restTemplate.postForObject(walletCreditAPI, request, String.class);

                JSONObject creditJson = new JSONObject(walletCreditStr);
                String responseCode = (String) creditJson.get("responseCode");

                if (responseCode.equals("00")) {
                    // save the details to db
                    stockPurchase = new WalletStockPurchase();
                    stockPurchase.setServiceType(stockPurchaseDTO.getServiceType());
                    stockPurchase.setWalletCode(walletCode);
                    stockPurchase.setOperatorId(new ObjectId(stockPurchaseDTO.getOperatorId()));
                    stockPurchase.setPurchaseCost(stockPurchaseDTO.getPurchaseCost());
                    stockPurchase.setPurchaseAmount(stockPurchaseDTO.getPurchaseAmount());
                    stockPurchase = walletUserService.createWalletStock(stockPurchase);

                    if (stockPurchase != null) {
                        stockPurchase.setSuccess(true);

                    } else {
                        stockPurchase = new WalletStockPurchase();
                        stockPurchase.setSuccess(false);
                        stockPurchase.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    stockPurchase = new WalletStockPurchase();
                    stockPurchase.setSuccess(false);
                    stockPurchase.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            }
            return stockPurchase;
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "session/walletStock/{operatorId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllPurchasedStocks(@PathVariable String operatorId) {

        try {
            User user = sessionService.getUser();
            List<WalletStockPurchaseDTO> walletStocks = null;
            if (user != null) {
                walletStocks=walletUserService.findWalletStockByOperator(new ObjectId(operatorId));
            }

            return new ResponseEntity<>(walletStocks, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/walletStocks/{operatorId}/{from_date}/{to_date}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllPurchasedStocks(@PathVariable String operatorId,
                                                   @PathVariable Date from_date, @PathVariable Date to_date) {

        try {
            User user = sessionService.getUser();
            List<WalletStockPurchaseDTO> walletStocks = null;
            if (user != null) {

                if(operatorId.equals("All")) {
                    walletStocks = walletUserService.findAllPurchasedStocks("All", from_date, to_date);

                }else{
                    walletStocks = walletUserService.findAllPurchasedStocks(operatorId, from_date, to_date);
                }
            }

            return new ResponseEntity<>(walletStocks, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/getSearchSubscriber/{keyword}/{isMobile}", method = RequestMethod.GET)
    public ResponseEntity<?> getSearchSubscriber(@PathVariable String keyword,
                                                 @PathVariable boolean isMobile) {
        try {

            User user = sessionService.getUser();
            List<WalletUserDTO> walletUser = null;
            User userByMobile = null;

            if (user != null) {
                if (isMobile) {
                    userByMobile = userService.findUserByMobileNo(keyword);
                } else {
                    userByMobile = userService.findUserByEmail(keyword);
                }
                if (userByMobile != null) {
                    walletUser = walletUserService.findUserByMobileNumber(userByMobile.getId());
                }
            }
            if (walletUser != null && walletUser.size() > 0) {
                return new ResponseEntity<>(walletUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(userByMobile, HttpStatus.OK);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/wallet/subscribers", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSubscriber() {
        try {

            User user = sessionService.getUser();
            List<WalletUserDTO> walletUsers = null;

            if (user != null) {
                walletUsers = walletUserService.findAllSubscribers();
            }

            return new ResponseEntity<>(walletUsers, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/transaction-reports/{transactionType}/{operatorId}/{from_date}/{to_date}", method = RequestMethod.GET)
    public ResponseEntity<?> getTransactionReports(@PathVariable int transactionType,
                                                   @PathVariable String operatorId,
                                                   @PathVariable Date from_date, @PathVariable Date to_date) {
        try {
            User user = sessionService.getUser();
            String type = "";
            List<WalletTransactionHistoryDTO> transactionHistory = null;

            if (user != null) {
                if ((transactionType == 0) && (operatorId.equals("All"))) {
                    transactionHistory = walletUserService.findTransactionHistoryByOperator("All", "All", from_date, to_date);
                } else {

                    if (transactionType == 1) {
                        type = "Mobile Top-up";
                    } 
                    if (transactionType == 2) {
                        type = "Bill Payment";
                    }
                    if (operatorId != null) {
                        transactionHistory = walletUserService.findTransactionHistoryByOperator(type, operatorId, from_date, to_date);
                    }
                }
            }
            return new ResponseEntity<>(transactionHistory, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/stock/send_email/{alertId}", method = RequestMethod.POST)
    public ResponseEntity<?> sendThresholdAlertsEmail(@PathVariable String alertId) {

        try {
            User user = sessionService.getUser();
            Customer customer = null;
            WalletThresholdAlerts stockAlert = walletUserService.findStockAlertId(new ObjectId(alertId));

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            if (user != null && stockAlert != null) {

                // Send email to stock user for every 30 minutes until the amount get higher than the threshold amount
                new SendAlerts(stockAlert, customer);
            }

            return new ResponseEntity<>(stockAlert, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    public class SendAlerts {

        Timer timer;

        public SendAlerts(WalletThresholdAlerts stockAlert, Customer customerInfo) {

            timer = new Timer();
            timer.schedule(new RemindTask(stockAlert, customerInfo),
                    0,        //initial delay
                    1 * 1800000);  //milliseconds
        }

        class RemindTask extends TimerTask {

            double thresholdAmount;
            double purchaseAmount;
            ObjectId operatorID;
            WalletThresholdAlerts alertInfo;
            Customer customer;

            public RemindTask(WalletThresholdAlerts stockAlert, Customer customerInfo) {
                operatorID = stockAlert.getOperatorId();
                thresholdAmount = stockAlert.getThresholdAmount();
                alertInfo = stockAlert;
                customer = customerInfo;
            }

            public void run() {
                List<WalletStockPurchaseDTO> stockPurchase = walletUserService.findWalletStockByOperator(operatorID);
                if (stockPurchase != null && stockPurchase.size() > 0) {

                    // Call mini statement api to get balance of the operator
                    purchaseAmount = getMiniStatement(stockPurchase.get(0).getWalletCode());
                    if (thresholdAmount >= purchaseAmount) {
                        boolean emailstatus = walletUserService.sendThresholdAlertsMailToUser(stockPurchase.get(0).getServiceInfo().getOperatorName(), alertInfo, purchaseAmount, customer);

                        if (emailstatus) {
                            updateThresholdEmailStatus(alertInfo, true);
                        }
                    } else {
                        updateThresholdEmailStatus(alertInfo, false);
                        timer.cancel();
//                    System.exit(0);
                    }
                }
            }

        }
    }



    public void updateThresholdEmailStatus(WalletThresholdAlerts alertInfo, boolean emailStatus) {

        try {

            WalletThresholdAlerts walletThresholdAlert = walletUserService.findStockAlertId(alertInfo.getId());

            if (walletThresholdAlert != null) {
                walletThresholdAlert.setHasEmailSent(emailStatus);
                walletThresholdAlert = walletUserService.updateThresholdAlert(alertInfo.getId(), walletThresholdAlert);
            }

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
        }

    }

    public double getMiniStatement(String walletCode) {

        try {
            double purchaseAmount = 0;

            String rrnNo = walletCode.substring(6);
            String walletcode = walletCode;

            // get macing of mini statement
            String macIng = Hashing.sha256().hashString(walletcode + "#" + rrnNo, StandardCharsets.UTF_8).toString();

            if (macIng != null) {

                String walletMiniStatementAPI = "http://5.32.59.231:4501/wallet/ministatement";

                JSONObject miniStm = new JSONObject();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                miniStm.put("walletCode", walletcode);
                miniStm.put("rrnNo", rrnNo);
                miniStm.put("macing", macIng);

                RestTemplate restTemplate = new RestTemplate();
                HttpEntity<String> request = new HttpEntity<String>(miniStm.toString(), headers);

                // post parameters for ministatement api to get balance
                String walletMiniStmStr = restTemplate.postForObject(walletMiniStatementAPI, request, String.class);

                JSONObject miniStmJson = new JSONObject(walletMiniStmStr);
                String responseCode = (String) miniStmJson.get("responseCode");

                if (responseCode.equals("00")) {
                    purchaseAmount = (double) miniStmJson.get("balance");
                }
            }
            return purchaseAmount;

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return 0;
        }
    }

    public String walletDebit(WalletDTO walletUser) {

        try {
            String responseCode = "";
            UserSubscription userSubscription = null;

            // debit amount from user wallet
            String macIng = Hashing.sha256().hashString(walletUser.getWalletCode() + "#" + walletUser.getRrnNo() + "#" + walletUser.getBankCode() + "#" + walletUser.getSubscription().getAmount(), StandardCharsets.UTF_8).toString();

            if (macIng != null) {


                JSONObject debit = new JSONObject();
                // call wallet credit api
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                debit.put("walletCode", walletUser.getWalletCode());
                debit.put("rrnNo", walletUser.getRrnNo());
                debit.put("bankCode", walletUser.getBankCode());
                debit.put("amount", walletUser.getSubscription().getAmount());
                debit.put("macing", macIng);
                debit.put("remark", "OK");

                String walletDebitAPI = "http://5.32.59.231:4501/wallet/debit";


                RestTemplate restTemplate = new RestTemplate();
                HttpEntity<String> request = new HttpEntity<String>(debit.toString(), headers);


                String walletDebitStr = restTemplate.postForObject(walletDebitAPI, request, String.class);

                JSONObject debitJson = new JSONObject(walletDebitStr);
                responseCode = (String) debitJson.get("responseCode");

                if (responseCode.equals("00")) {
                    userSubscription = createSubscription(walletUser, responseCode);
                }
            }
            return responseCode;

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return null;
        }
    }

    public UserSubscription createSubscription(WalletDTO walletUser, String ResponseCode) {
        UserSubscriptionDTO userSubscriptionDTO = new UserSubscriptionDTO();
        UserSubscription userSubscription = null;

        // get macing of mini statement
        String macIng = Hashing.sha256().hashString(walletUser.getWalletCode() + "#" + walletUser.getRrnNo(), StandardCharsets.UTF_8).toString();

        if (macIng != null) {

            String walletMiniStatementAPI = "http://5.32.59.231:4501/wallet/ministatement";

            JSONObject miniStm = new JSONObject();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            miniStm.put("walletCode", walletUser.getWalletCode());
            miniStm.put("rrnNo", walletUser.getRrnNo());
            miniStm.put("macing", macIng);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<String> request = new HttpEntity<String>(miniStm.toString(), headers);

            // post parameters for ministatement api to get balance
            String walletMiniStmStr = restTemplate.postForObject(walletMiniStatementAPI, request, String.class);

            JSONObject miniStmJson = new JSONObject(walletMiniStmStr);
            String responseCode = (String) miniStmJson.get("responseCode");
            JSONArray transactions = (JSONArray) miniStmJson.get("transactions");

            if (responseCode.equals("00")) {

                JSONObject transactionInfo = new JSONObject(transactions.getJSONObject(0).toString());
                String tranId = (String) transactionInfo.get("tranId");
                String referenceNo = ebsPaymentController.generateReferenceNumber();

                if (tranId != null && referenceNo != null) {
                    User user = userService.find(walletUser.getUser_id());
                    if (user != null) {
                        userSubscriptionDTO.setPaymentAmount(walletUser.getSubscription().getAmount());
                        userSubscriptionDTO.setTransactionId(tranId);
                        userSubscriptionDTO.setPaymentMode("Kaftan Wallet");
                        userSubscriptionDTO.setSubscriptionId(walletUser.getSubscription().getId());
                        userSubscriptionDTO.setReferenceNumber(referenceNo);

                        userSubscriptionDTO.setPaymentStatus(true);
                        userSubscription = subscriptionController.createSubscription(user, userSubscriptionDTO);
                        if (userSubscription != null && userSubscription.isSuccess()) {

                            userSubscriptionDTO.setSubscriptionInfo(walletUser.getSubscription());
                            userSubscriptionDTO.setSubscriptionStarted_at(userSubscription.getSubscriptionStarted_at());
                            userSubscriptionDTO.setSubscriptionEnd_at(userSubscription.getSubscriptionEnd_at());

                            ebsPaymentController.sendSubscriptionEmail(user, userSubscriptionDTO, true);
                        }
                    }
                }
            }
        }
        return userSubscription;

    }

    @PostConstruct
    public boolean autoSubscriptionProcess() {

        try {

            ExecutorService autoSubscriptionExecutor = Executors.newSingleThreadExecutor();
            autoSubscriptionExecutor.execute(new Runnable() {
                @Override
                public void run() {
                    try {

                        new CallSubcriptionProcess();

                    } catch (Exception e) {
                        logger.error("failed", e);
                    }
                }
            });
            return true;
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return false;
        }
    }


    public class CallSubcriptionProcess {
        Timer timer;

        public CallSubcriptionProcess() {
            Date date = new Date();
            LocalDate currentDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

//            Calendar today = Calendar.getInstance();
//            today.set(Calendar.HOUR_OF_DAY, 12);
//            today.set(Calendar.AM_PM, Calendar.AM);
//            today.set(Calendar.MINUTE, 1);
//            today.set(Calendar.SECOND, 0);
//            timer.schedule(new CheckUserSubcription(currentDate),today.getTime());

            timer = new Timer();
            timer.schedule(new CheckUserSubcription(currentDate),
                    0,
                    1 * 43200000); // calls the method every 12 hours (43200000 milli seconds)
        }


        class CheckUserSubcription extends TimerTask {
            LocalDate currentDate;

            public CheckUserSubcription(LocalDate current_date) {
                currentDate = current_date;
            }

            public void run() {

                DateFormat dateFormat = new SimpleDateFormat("hh.mm aa");
                String currentTime = dateFormat.format(new Date()).toString();
                Logger logger = LoggerFactory.getLogger(this.getClass());


                List<WalletDTO> walletUsers = walletUserService.findAllActiveWalletUsers();

                if (walletUsers != null && walletUsers.size() > 0) {

                    logger.info("Auto subscription process start at " + currentTime);

                    walletUsers.stream().forEach(walletUser -> {
                        String responseCode = "";

                        LocalDate endDate = walletUser.getUserSubscriptionInfo().getSubscriptionEnd_at().plusDays(1);

                        if (endDate.isEqual(currentDate) || endDate.isBefore(currentDate)) {

                            if (walletUser.getBalance() > walletUser.getSubscription().getAmount()) {
                                responseCode = walletDebit(walletUser);

                            } else {
                                userSubscriptionService.sendWalletInsufficientAmtAlertMail(walletUser.getUserInfo());
                            }
                        }

                    });
                }
                logger.info("Task executed at " + currentTime);
            }
        }
    }

    @RequestMapping(value = "admin/session/user/wallet/create/threshold_alerts/{operatorId}", method = RequestMethod.POST)
    public ResponseEntity<?> createThresholdAlert(@RequestBody final WalletThresholdAlertsDTO thresholdAlert, @PathVariable String operatorId) {

        try {
            User user = sessionService.getUser();
            WalletThresholdAlerts stockAlert = null;

            if (user != null && thresholdAlert != null) {

                if (thresholdAlert.getId() != null) {
                    stockAlert = walletUserService.findStockAlertId(new ObjectId(thresholdAlert.getId()));
                    if (stockAlert.getId() != null) {
                        stockAlert.setOperatorId(new ObjectId(operatorId));
                        stockAlert.setName(thresholdAlert.getName());
                        stockAlert.setMobileNo(thresholdAlert.getMobileNo());
                        stockAlert.setEmailId(thresholdAlert.getEmailId());
                        stockAlert.setHasEmailSent(false);
                        stockAlert.setThresholdAmount(thresholdAlert.getThresholdAmount());
                        stockAlert = walletUserService.updateThresholdAlert(stockAlert.getId(), stockAlert);
                    }
                } else {
                    stockAlert = new WalletThresholdAlerts();
                    stockAlert.setOperatorId(new ObjectId(operatorId));
                    stockAlert.setName(thresholdAlert.getName());
                    stockAlert.setMobileNo(thresholdAlert.getMobileNo());
                    stockAlert.setEmailId(thresholdAlert.getEmailId());
                    stockAlert.setThresholdAmount(thresholdAlert.getThresholdAmount());
                    stockAlert.setHasEmailSent(false);
                    stockAlert = walletUserService.createThresholdAlert(stockAlert);
                }
            }
            return new ResponseEntity<>(stockAlert, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/user/wallet/threshold_alerts/{operatorId}", method = RequestMethod.GET)
    public ResponseEntity<?> getThresholdAlertsByOperator(@PathVariable String operatorId) {

        try {

            User user = sessionService.getUser();
            List<WalletThresholdAlerts> stockAlerts = null;

            if (user != null) {
                stockAlerts = walletUserService.findStockAlertByOperator(new ObjectId(operatorId));
            }

            return new ResponseEntity<>(stockAlerts, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "admin/session/transaction/summary/{from_date}/{to_date}", method = RequestMethod.GET)
    public ResponseEntity<?> getTransactionSummary(@PathVariable Date from_date, @PathVariable Date to_date) {
        try {

            List<WalletTransactionHistoryDTO> walletTransactionHistory = null;

            walletTransactionHistory = walletUserService.findTransactionSummary(from_date,to_date);

            return new ResponseEntity<>(walletTransactionHistory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = "session/user/wallet/user/card_info/create", method = RequestMethod.POST)
    public ResponseEntity<?> createWalletUserCardDetails(@RequestBody final WalletUserCardInfoDTO cardInfoDTO) {

        try {
            User user = sessionService.getUser();
            WalletUserCardInfo cardInfo = new WalletUserCardInfo();

            if (user != null) {
                String card_No = encrypt(cardInfoDTO.getCardNo(),secretKey);

                cardInfo = walletUserService.findcardNoByUserIdandCard(user.getId(), card_No);

                if (cardInfo == null) {
                    cardInfo = new WalletUserCardInfo();
                    cardInfo.setUserId(user.getId());
                    cardInfo.setCardNo(card_No);
                    cardInfo.setExpiryDate(cardInfoDTO.getExpiryDate());
                    cardInfo.setCardHolderName(cardInfoDTO.getCardHolderName());
                    cardInfo.setIs_active(true);
                    cardInfo = walletUserService.createCardInfo(cardInfo);

                    if (cardInfo != null) {
                        cardInfo.setSuccess(true);
                    } else {
                        cardInfo = new WalletUserCardInfo();
                        cardInfo.setSuccess(false);
                        cardInfo.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    cardInfo = new WalletUserCardInfo();
                    cardInfo.setSuccess(false);
                    cardInfo.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            }
            return new ResponseEntity<>(cardInfo, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/wallet/user/card_info", method = RequestMethod.GET)
    public ResponseEntity<?> getUserCardInfo() {

        try {

            User user = sessionService.getUser();
            List<WalletUserCardInfo> userCardDetails = null;

            if (user != null) {
                userCardDetails = walletUserService.findcardNoByUserid(user.getId());

                if (userCardDetails != null && userCardDetails.size() > 0) {
                    userCardDetails.stream().forEach(cardInfo -> {
                        String cardNo = decrypt(cardInfo.getCardNo(), secretKey);
                        cardInfo.setCardNo(cardNo);
                    });
                }

            }
            return new ResponseEntity<>(userCardDetails, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/parsePhoneNumber/{mobileNo}", method = RequestMethod.GET)
    public ResponseEntity<?> getPhoneNumber(@PathVariable String mobileNo) {
        try {

            HashMap userPhoneHash = new HashMap();
            if(mobileNo.length()>0) {
                PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
                Phonenumber.PhoneNumber numberProto = phoneUtil.parse(mobileNo, "");
                int countryCode = numberProto.getCountryCode();
                long nationalNumber = numberProto.getNationalNumber();

                userPhoneHash.put("countryCode", countryCode);
                userPhoneHash.put("nationalNumber", nationalNumber);
                userPhoneHash.put("Success", true);
                userPhoneHash.put("message", "Success!!");
            }
            else{
                userPhoneHash.put("Success", false);
                userPhoneHash.put("message", "Mobile Number Invalid!!");
            }
            return new ResponseEntity<>(userPhoneHash, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public String encrypt(String strToEncrypt, String secret)
    {
        try
        {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, setKey(secret));
            return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
        }
        catch (Exception e)
        {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return null;
        }
    }

    public String decrypt(String strToDecrypt, String secret)
    {
        try
        {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, setKey(secret));
            return new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
        }
        catch (Exception e)
        {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return null;
        }
    }

    public SecretKeySpec setKey(String myKey) {
        MessageDigest sha = null;
        SecretKeySpec secretKey;
        byte[] key;
        try {
            key = myKey.getBytes("UTF-8");
            sha = MessageDigest.getInstance("SHA-1");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16);
            secretKey = new SecretKeySpec(key, "AES");
            return secretKey;

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return null;
        }
    }
    @RequestMapping(value = "admin/session/charges/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody final ChargeConfigurationDTO chargeConfigurationDTO) {

        try {
            WalletCharges chargeConfiguration = walletUserService.findChargeConfigurationByOperator(chargeConfigurationDTO.getOperatorId());

            if (chargeConfiguration == null) {
                chargeConfiguration = new WalletCharges();
                chargeConfiguration.setOperatorId(chargeConfigurationDTO.getOperatorId());
                chargeConfiguration.setHasPercentage(chargeConfigurationDTO.isHasPercentage());
                chargeConfiguration.setChargeValue(chargeConfigurationDTO.getChargeValue());
                chargeConfiguration = walletUserService.createCharge(chargeConfiguration);

                if (chargeConfiguration != null) {
                    chargeConfiguration.setSuccess(true);
                    chargeConfiguration.setMessage(AppMessages.CHARGE_CONFIGURATION_CREATED);
                } else {
                    chargeConfiguration = new WalletCharges();
                    chargeConfiguration.setSuccess(false);
                    chargeConfiguration.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                chargeConfiguration.setSuccess(false);
                chargeConfiguration.setMessage(AppMessages.CHARGE_CONFIGURATION_EXISTS);
            }
            return new ResponseEntity<>(chargeConfiguration, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/charges/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody final ChargeConfigurationDTO chargeConfigurationDTO) {

        try {
            WalletCharges chargeConfiguration = walletUserService.findCharge(id);

            if (chargeConfiguration != null) {

                chargeConfiguration.setOperatorId(chargeConfigurationDTO.getOperatorId());
                chargeConfiguration.setHasPercentage(chargeConfigurationDTO.isHasPercentage());
                chargeConfiguration.setChargeValue(chargeConfigurationDTO.getChargeValue());
                chargeConfiguration = walletUserService.updateCharge(new ObjectId(id), chargeConfiguration);

                if (chargeConfiguration != null) {
                    chargeConfiguration.setSuccess(true);
                    chargeConfiguration.setMessage(AppMessages.CHARGE_CONFIGURATION_UPDATED);
                } else {
                    chargeConfiguration = new WalletCharges();
                    chargeConfiguration.setSuccess(false);
                    chargeConfiguration.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                chargeConfiguration = new WalletCharges();
                chargeConfiguration.setSuccess(false);
                chargeConfiguration.setMessage(AppMessages.CHARGE_CONFIGURATION_NOT_EXISTS);
            }
            return new ResponseEntity<>(chargeConfiguration, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/charges/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getCharge(@PathVariable String id) {

        try {
            WalletCharges chargeConfiguration = walletUserService.findCharge(id);

            if (chargeConfiguration != null) {
                chargeConfiguration.setSuccess(true);
            } else {
                chargeConfiguration = new WalletCharges();
                chargeConfiguration.setSuccess(false);
                chargeConfiguration.setMessage(AppMessages.CHARGE_CONFIGURATION_NOT_EXISTS);
            }
            return new ResponseEntity<>(chargeConfiguration, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/allCharges", method = RequestMethod.GET)
    public ResponseEntity<?> getAllCharges() {
        try {
            List<ChargeConfigurationDTO> chargeConfiguration = null;

            chargeConfiguration = walletUserService.findAllCharges();

            return new ResponseEntity<>(chargeConfiguration, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = "session/walletCharges/{operatorId}", method = RequestMethod.GET)
    public ResponseEntity<?> getChargesByOperator(@PathVariable String operatorId) {
        try {

            List<ChargeConfigurationDTO> chargeConfiguration = null;

            chargeConfiguration = walletUserService.findWalletChargesByOperator(new ObjectId(operatorId));

            return new ResponseEntity<>(chargeConfiguration, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = "admin/session/services/operators/create", method = RequestMethod.POST)
    public ResponseEntity<?> createOperators(@RequestBody final List<ServicesDTO> servicesDTO) {
        WalletOperators walletOperator = new WalletOperators();

        try {

            if (servicesDTO != null && servicesDTO.size() > 0) {    //MAIN CATEGORY SERVICES

                servicesDTO.stream().forEach(serviceInfo -> {
                    String opertatorCode = Integer.toString(serviceInfo.getOperatorCode());

                    WalletOperators walletOperators = walletService.findServiceByName(serviceInfo.getName(), opertatorCode);
                    if (walletOperators == null) {
                        walletOperators = new WalletOperators();
                        walletOperators.setName(serviceInfo.getName());
                        walletOperators.setServiceType(0);
                        walletOperators.setCategoryId(0);
                        walletOperators.setOperatorCode("0");
                        walletOperators.setOperatorName("Service");
                        walletOperators.setActive(true);
                        walletOperators.setUpdate(true);
                        walletOperators.setDenominations(null);
                        walletOperators = walletService.create(walletOperators);
                    }
                });

                //MOBILE OPERATORS
                walletOperator = createMobileOperators();

                //BANK OPERATORS
                createBankOperators();

                //CATEGORY BASED BILLERS
                walletOperator = createBillOperators();
            }

            return new ResponseEntity<>(walletOperator, HttpStatus.OK);
        } catch (Exception e) {
            walletOperator.setSuccess(false);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/transaction/history", method = RequestMethod.GET)
    public ResponseEntity<?> getTransactionHistory() {
        try {

            User user = sessionService.getUser();
            List<WalletUserDTO> walletUsers = null;
            List<WalletTransactionHistory> walletTransactionHistory = null;
            HashMap walletDetails = new HashMap();

            if (user != null) {

                walletUsers = walletUserService.findAllSubscribers();

                walletDetails.put("walletUsers", walletUsers);

                if (walletUsers != null) {

                    walletTransactionHistory = walletUserService.findAllTransactionHistory();

                    walletDetails.put("walletTransactionHistory", walletTransactionHistory);
                }
            }
            return new ResponseEntity<>(walletDetails, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = "admin/session/transactionreport/transactionType", method = RequestMethod.GET)
    public ResponseEntity<?> gettransactionreportByType() {
        try {

            List<WalletTransactionHistoryDTO> walletTransactionHistory = null;

            walletTransactionHistory = walletUserService.findTransactionReportbyType();

            return new ResponseEntity<>(walletTransactionHistory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }

    }


    private void createBankOperators() {

        List<BankTransferTypeDTO> transferTypes = new ArrayList<>();
        BankTransferTypeDTO transferType = new BankTransferTypeDTO();
        transferType.setId("1");
        transferType.setType("Money Transfer to Bank");
        transferTypes.add(transferType);
        transferType = new BankTransferTypeDTO();
        transferType.setId("2");
        transferType.setType("Money Transfer to Kaftan Customer");
        transferTypes.add(transferType);

        for (BankTransferTypeDTO transfer : transferTypes) {

            WalletOperators walletOperators = walletService.findServiceByName("Money Transfer", transfer.getId());
            if (walletOperators == null) {
                walletOperators = new WalletOperators();
                walletOperators.setName("Money Transfer");
                walletOperators.setServiceType(3);
                walletOperators.setCategoryId(0);
                walletOperators.setOperatorCode(transfer.getId());
                walletOperators.setOperatorName(transfer.getType());
                walletOperators.setActive(true);
                walletOperators.setUpdate(true);
                walletOperators = walletService.create(walletOperators);
            }
        }
    }

    private WalletOperators createMobileOperators() {
        final WalletOperators walletOperator = new WalletOperators();

        try {
            String mobileOperatorsAPI = "http://5.32.59.231:9020/MyanmarMDBMNOTest/api/getOperators";

            RestTemplate restTemplate = new RestTemplate();
            String mobileOperatorsStr = restTemplate.getForObject(mobileOperatorsAPI, String.class);

            ObjectMapper mapper = new ObjectMapper();

            List<MobileOperatorsDTO> mobileOperators = mapper.readValue(mobileOperatorsStr, new
                    TypeReference<List<MobileOperatorsDTO>>() {
                    });

            if(mobileOperators !=null && mobileOperators.size()>0) {

                mobileOperators.stream().forEach(operatorInfo -> {

                    WalletOperators walletOperators = walletService.findServiceByName("Mobile Recharge", operatorInfo.getOperatorCode());

                    if (walletOperators == null) {
                        walletOperators = new WalletOperators();
                        walletOperators.setName("Mobile Recharge");
                        walletOperators.setServiceType(1);
                        walletOperators.setCategoryId(0);
                        walletOperators.setOperatorCode(operatorInfo.getOperatorCode());
                        walletOperators.setOperatorName(operatorInfo.getName());
                        walletOperators.setActive(true);
                        walletOperators.setUpdate(true);
                        walletOperators = walletService.create(walletOperators);

                    } else {
                        walletOperators.setOperatorName(operatorInfo.getName());
                        walletOperators = walletService.update(walletOperators.getId(), walletOperators);
                    }
                });
                walletOperator.setSuccess(true);
            }
            return walletOperator;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    private WalletOperators createBillOperators() {
        final WalletOperators walletOperator = new WalletOperators();
        try {

            String getBillerCategoriesAPI = "http://5.32.59.231:9020/MyanmarBPTest/api/getCategories";
            RestTemplate restTemplate = new RestTemplate();
            String categoriesStr = restTemplate.getForObject(getBillerCategoriesAPI, String.class);

            ObjectMapper mapper = new ObjectMapper();
            List<MobileOperatorsDTO> billerCategories = mapper.readValue(categoriesStr, new
                    TypeReference<List<MobileOperatorsDTO>>() {
                    });

            if (billerCategories !=null && billerCategories.size() > 0) {

                billerCategories.stream().forEach(categoryInfo -> {
                    try {
                        String getBillersByCategoryIdAPI = "http://5.32.59.231:9020/MyanmarBPTest/api/getOperators?categoryCode=" + categoryInfo.getCategoryCode();
                        RestTemplate innerCategoryRestTemplate = new RestTemplate();

                        String billersStr = innerCategoryRestTemplate.getForObject(getBillersByCategoryIdAPI, String.class);
                        ObjectMapper billerMapper = new ObjectMapper();

                        List<MobileOperatorsDTO> billerList = billerMapper.readValue(billersStr, new
                                TypeReference<List<MobileOperatorsDTO>>() {
                                });

                        if (billerList !=null && billerList.size() > 0)
                        {
                            billerList.stream().forEach(billersVal -> {
                                Integer categoryCode=Integer.parseInt(categoryInfo.getCategoryCode());
                                WalletOperators walletOperators = walletService.findBillerOperator("Bill Payment",categoryCode , billersVal.getOperatorCode());

                                if (walletOperators == null) {
                                    walletOperators = new WalletOperators();
                                    walletOperators.setName("Bill Payment");
                                    walletOperators.setServiceType(2);
                                    walletOperators.setCategoryId(categoryCode);
                                    walletOperators.setCategoryName(categoryInfo.getName());
                                    walletOperators.setOperatorCode(billersVal.getOperatorCode());
                                    walletOperators.setOperatorName(billersVal.getName());
                                    walletOperators.setActive(true);
                                    walletOperators.setUpdate(true);
                                    walletOperators = walletService.create(walletOperators);

                                }else {
                                    walletOperators.setOperatorName(billersVal.getName());
                                    walletOperators = walletService.update(walletOperators.getId(), walletOperators);
                                }
                            });
                            walletOperator.setSuccess(true);
                        }

                    } catch (Exception e) {
                        logger.error(e.getMessage(), e);
                    }
                });
            }
            return walletOperator;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @RequestMapping(value = "admin/session/services/operator/create", method = RequestMethod.POST)
    public ResponseEntity<?> createOperator(@RequestBody final ServicesDTO servicesDTO) {
        WalletOperators walletOperators = new WalletOperators();

        try {
            if (servicesDTO != null) {

                String opertatorCode = Integer.toString(servicesDTO.getOperatorCode());

                walletOperators = walletService.findServiceByName(servicesDTO.getName(), opertatorCode);
                if (walletOperators == null) {
                    walletOperators = new WalletOperators();
                    walletOperators.setName(servicesDTO.getName());
                    walletOperators.setServiceType(servicesDTO.getServiceType());
                    walletOperators.setCategoryId(servicesDTO.getCategoryId());
                    walletOperators.setCategoryName(servicesDTO.getCategoryName());
                    walletOperators.setOperatorCode(opertatorCode);
                    walletOperators.setOperatorName(servicesDTO.getOperatorName());
                    walletOperators.setActive(false);
                    walletOperators.setUpdate(false);
                    walletOperators = walletService.create(walletOperators);
                    if (walletOperators != null) {
                        walletOperators.setSuccess(true);

                    } else {
                        walletOperators = new WalletOperators();
                        walletOperators.setSuccess(false);
                        walletOperators.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                }
            }

            return new ResponseEntity<>(walletOperators, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "session/services/getOperators", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOperators() {
        try {

            User user = sessionService.getUser();
            List<ServicesDTO> operators = new ArrayList<>();

            if (user != null) {
                operators = walletService.findAllOperators();
            }
            return new ResponseEntity<>(operators, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/services/getOperators/{serviceTypeId}", method = RequestMethod.GET)
    public ResponseEntity<?> getOperatorsByService(@PathVariable int serviceTypeId) {
        try {

            User user = sessionService.getUser();
            List<WalletOperators> operators = new ArrayList<>();

            if (user != null) {
                operators = walletService.findOperatorsByService(serviceTypeId);
            }
            return new ResponseEntity<>(operators, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/services/operator/update/{operatorId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateOperator(@PathVariable String operatorId,
                                            @RequestBody final ServicesDTO servicesDTO) {
        try {

            WalletOperators walletOperator = walletService.find(new ObjectId(operatorId));
            if (walletOperator != null) {
                walletOperator.setName(walletOperator.getName());
                walletOperator.setServiceType(walletOperator.getServiceType());
                walletOperator.setCategoryId(walletOperator.getCategoryId());
                walletOperator.setOperatorCode(walletOperator.getOperatorCode());
                walletOperator.setOperatorName(walletOperator.getOperatorName());
                walletOperator.setActive(servicesDTO.isActive());
                walletOperator.setDenominations(walletOperator.getDenominations());
                walletOperator = walletService.update(new ObjectId(operatorId), walletOperator);
                if (walletOperator != null) {
                    walletOperator.setSuccess(true);
                } else {
                    walletOperator = new WalletOperators();
                    walletOperator.setSuccess(false);
                    walletOperator.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                walletOperator = new WalletOperators();
                walletOperator.setSuccess(false);
            }

            return new ResponseEntity<>(walletOperator, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/wallet/subscribersbymonth", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSubscriberByMonth() {
        try {
            LocalDate startDate = LocalDate.now().minusMonths(5);
            LocalDate endDate = LocalDate.now().plusDays(1);

            User user = sessionService.getUser();
            List<WalletUserDTO> walletUsers = null;

            DateFormat formater = new SimpleDateFormat("yyyy-MM");
            String startdate = "";
            String enddate = "";
            ArrayList subscriberList = new ArrayList(6);
            subscriberList.add(0);
            subscriberList.add(0);
            subscriberList.add(0);
            subscriberList.add(0);
            subscriberList.add(0);
            subscriberList.add(0);

            boolean isSubscribers0 = false;
            boolean isSubscribers1 = false;
            boolean isSubscribers2 = false;
            boolean isSubscribers3 = false;
            boolean isSubscribers4 = false;
            boolean isSubscribers5 = false;

            Integer startDateCount = startDate.getMonthValue();
            Integer endDateCount = endDate.getMonthValue();
            Integer total = startDateCount - endDateCount;
            if (total == -5) {
                total = 5;
            }
            if (startDateCount > 10) {
                startdate = "" + startDate.getYear() + "-" + startDate.getMonthValue();
            } else {
                startdate = "" + startDate.getYear() + "-" + "0" + startDate.getMonthValue();
            }
            if (endDateCount > 10) {
                enddate = "" + endDate.getYear() + "-" + endDate.getMonthValue();
            } else {
                enddate = "" + endDate.getYear() + "-" + "0" + endDate.getMonthValue();
            }

            Calendar beginCalendar = Calendar.getInstance();
            Calendar finishCalendar = Calendar.getInstance();

            beginCalendar.setTime(formater.parse(startdate));
            finishCalendar.setTime(formater.parse(enddate));
            List<String> date = new ArrayList<>();
            for (int i = 0; i <= total; i++) {
                // add one month to date per loop
                String monthstr = formater.format(beginCalendar.getTime());
                date.add(monthstr);
                beginCalendar.add(Calendar.MONTH, 1);
            }

            if (user != null) {

                walletUsers = walletUserService.findAllSubscribersbyMonth(startDate, endDate);

                for (int i = 0; i < walletUsers.size(); i++) {

                    List subscribers = new ArrayList();
                    subscribers.add(walletUsers.get(i).getSubscriptionDate());
                    subscribers.add(walletUsers.get(i).getTotalSubscribers());

                    if (date.get(0).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);
                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(0, subscribers);
                        isSubscribers0 = true;
                    } else {
                        if (!isSubscribers0) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(0));
                            subscriber.add(0);
                            if (date.get(0) != null) {
                                String[] splitDate = date.get(0).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);
                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(0, subscriber);
                            } else {
                                subscriberList.set(0, subscriber);
                            }
                        }
                    }
                    if (date.get(1).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);
                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(1, subscribers);
                        isSubscribers1 = true;
                    } else {
                        if (!isSubscribers1) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(1));
                            subscriber.add(0);
                            if (date.get(1) != null) {
                                String[] splitDate = date.get(1).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);

                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(1, subscriber);
                            } else {
                                subscriberList.set(1, subscriber);
                            }
                        }
                    }
                    if (date.get(2).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);
                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(2, subscribers);
                        isSubscribers1 = true;
                    } else {
                        if (!isSubscribers2) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(0));
                            subscriber.add(0);
                            if (date.get(2) != null) {
                                String[] splitDate = date.get(2).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);

                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(2, subscriber);
                            } else {
                                subscriberList.set(2, subscriber);
                            }
                        }
                    }
                    if (date.get(3).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);

                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(3, subscribers);
                        isSubscribers3 = true;
                    } else {
                        if (!isSubscribers3) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(0));
                            subscriber.add(0);
                            if (date.get(3) != null) {
                                String[] splitDate = date.get(3).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);

                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(3, subscriber);
                            } else {
                                subscriberList.set(3, subscriber);
                            }
                        }

                    }
                    if (date.get(4).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);
                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(4, subscribers);
                        isSubscribers4 = true;
                    } else {
                        if (!isSubscribers4) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(0));
                            subscriber.add(0);
                            if (date.get(4) != null) {
                                String[] splitDate = date.get(4).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);

                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(4, subscriber);
                            } else {
                                subscriberList.set(4, subscriber);
                            }
                        }

                    }
                    if (date.get(5).equals(walletUsers.get(i).getSubscriptionDate())) {
                        String[] splitDate = walletUsers.get(i).getSubscriptionDate().split("-");
                        Integer month = Integer.parseInt(splitDate[1]);
                        if (splitDate[1] != null) {
                            subscribers.set(0, getMonth(month) + "-" + splitDate[0]);
                        }
                        subscriberList.set(5, subscribers);
                        isSubscribers5 = true;
                    } else {
                        if (!isSubscribers5) {
                            List subscriber = new ArrayList();
                            subscriber.add(date.get(0));
                            subscriber.add(0);
                            if (date.get(5) != null) {
                                String[] splitDate = date.get(5).split("-");
                                Integer month = Integer.parseInt(splitDate[1]);

                                if (splitDate[1] != null) {
                                    subscriber.set(0, getMonth(month) + "-" + splitDate[0]);
                                }
                                subscriberList.set(5, subscriber);
                            } else {
                                subscriberList.set(5, subscriber);
                            }
                        }
                    }
                }
            }
            return new ResponseEntity<>(subscriberList, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(CommonErrorMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public String getMonth(int month) {
        String monthname =  new DateFormatSymbols().getMonths()[month - 1];
        String monthValue = "";
        if (monthname.length() > 3)
        {
            monthValue = monthname.substring(0, 3);
        }
        else
        {
            monthValue = monthname;
        }
        return monthValue;
    }
}
