import { state } from '@angular/core';
const baseUrl = "";
export class RestAPI {
    static LOGIN = baseUrl +'/api/user/login';
    // static LOGOUT = '/api/session/user/logout';
    static GET_LOGEDDIN_USER = 'api/session/user';
    static POST_SIGNUP_USER = 'api/user/create';
    static POST_RESEND_EMAIL = '/api/user/email/activation';
    static GET_VALIDATE_EMAIL = '/api/user/validate/email/';
    static POST_FORGOT_PASSWORD = '/api/user/forgot/password';
    static KEEP_ALIVE = '/api/keepAlive/';
    static GET_USER = 'api/admin/session/user';
    static GET_USER_BY_TOKEN = 'api/user/{0}';
    static PUT_USER = 'api/user/update';
    static CHANGE_PASSWORD = 'api/session/user/change/password';
    static PUT_FAVORITE_CONTENT = 'api/session/user/addToFavorite';
    static DELETET_FAVORITE_CONTENT = 'api/session/user/removeFromFavorite';
    static GET_MY_FAVORITE_CONTENT = 'api/session/user/myFavoriteList';
    static POST_NEW_PLAYLIST = 'api/session/user/addplaylist';
    static PUT_PLAYLIST = 'api/session/user/editplaylist';
    static DELETE_PLAYLIST = 'api/session/user/removeplaylist';
    static PUT_PLAYLIST_CONTENT = 'api/session/user/addtoplaylist';
    static DELETE_PLAYLIST_CONTENT = 'api/session/user/removefromplaylist';
    static GET_MY_PLAYLIST = 'api/session/user/myPlayList';
    static GET_AUDIOURL_TO_PLAY_ALL = 'api/session/user/myplaylist/playallsongs';

    //Customer
    static GET_LOGEDDIN_CUSTOMER = 'api/customer/getcustomer';
    static GET_LOGEDDIN_CUSTOMER_FOR_ADMIN = 'api/customer/admin/session/getcustomer';
    static PUT_CUSTOMER_LOGO = 'api/customer/admin/session/add/logo';
    static PUT_CUSTOMER_FAVICON = 'api/customer/admin/session/add/favicon';
    static PUT_CUSTOMER_EMAIL_SETTINGS = 'api/customer/admin/session/update/email/settings';
    static PUT_CUSTOMER_AWS_SETTINGS = 'api/customer/admin/session/update/aws/settings';
    static PUT_CUSTOMER_SOCIAL_SIGNUP_SETTINGS = 'api/customer/admin/session/update/social_signup/settings';
    static PUT_CUSTOMER_SOCIAL_MEDIA_LINKS = 'api/customer/admin/session/update/socialmedia_links/settings';
    static PUT_CUSTOMER_PAYMENT_SETTINGS = 'api/customer/admin/session/update/payment/settings';
    static PUT_EMAIL_HEADER_IMAGE = 'api/customer/admin/session/upload/emailheaderimage';
    static PUT_FIREBASE_SETTINGS = '/api/customer/admin/session/update/firebase/settings';
    static PUT_VIDEO_CALL_SETTINGS = '/api/customer/admin/session/update/videoCalling/settings';
    static PUT_CLOUD_MESSAGING_SETTINGS = '/api/customer/admin/session/update/cloudMessaging/settings';

    //Static Pages
    static POST_NEW_STATIC_PAGE = 'api/admin/session/staticpage/create';
    static GET_ALL_STATIC_PAGES_FOR_ADMIN = 'api/admin/session/staticpages';
    static GET_STATIC_PAGE_FOR_ADMIN = 'api/admin/session/staticpage';
    static PUT_STATIC_PAGE = 'api/admin/session/staticpage/update';
    static DELETE_STATIC_PAGE = 'api/admin/session/staticpage/delete';
    static PUT_STATIC_PAGES_RE_ORDER = '/api/admin/session/staticpage';
    static GET_ALL_STATIC_PAGES_FOR_USER = 'api/staticpages';
    static GET_STATIC_PAGE_FOR_USER = 'api/staticpage';

    // Admin Users
    static POST_ADMIN_USER = 'api/admin/session/admin_users/create';
    static GET_ALL_ADMIN_USER = 'api/admin/session/admin_users';
    static PUT_ADMIN_USER = 'api/admin/session/admin_users/update';
    static GET_ALL_SIGNUP_USER = "api/admin/session/signup_users";

    //Get all roles 
    static GET_ALL_ROLES = '/api/admin/session/all-roles';

    // Category
    static GET_ALL_CATEGORY_BY_TYPE = '/api/category/by-type/{0}';
    static GET_ALL_CATEGORY = '/api/category/all';
    static GET_CATEGORY = '/api/category';
    static PUT_UPDATE_CATEGORY = '/api/admin/session/category/{0}/{1}';
    static DELETE_CATEGORY = '/api/admin/session/category';
    static PUT_REORDER_CATEGORY = '/api/admin/session/category/{0}/re-order';
    static POST_CREATE_CATEGORY = '/api/admin/session/category/{0}/create';
    //Home Banner
    static GET_ALL_HOME_BANNER = '/api/home-banner';
    static POST_CREATE_HOME_BANNER = '/api/admin/session/home-banner/create';
    static DELETE_HOME_BANNER = '/api/admin/session/home-banner/delete';
    static PUT_REORDER_BANNER = '/api/admin/session/home-banner/re-order';

    // Content
    static GET_ALL_CONTENT = '/api/admin/session/all';
    static GET_CONTENT = '/api/content';
    static GET_CONTENT_TO_PLAY = '/api/session/content/watch';
    static GET_ADMIN_CONTENT = '/api/admin/session/content';
    static PUT_UPDATE_CONTENT = '/api/admin/session/content/update';
    static DELETE_CONTENT = '/api/admin/session/content/delete';
    static GET_ASSINED_CONTENT = '/api/assigned_content'
    static GET_ADMIN_ASSINED_CONTENT = '/api/admin/assigned_content'
    static GET_ADMIN_UNASSINED_CONTENT = '/api/admin/unassigned_content'
    static POST_CREATE_CONTENT = '/api/admin/session/content/create';
    static PUT_MAP_CONTENT_TO_CATEGORY = '/api/admin/session/content/add';
    static PUT_REMOVE_CONTENT_CATEGORY_MAPPING = '/api/admin/session/content/remove';
    static PUT_CONTENT_RE_ORDDER = '/api/admin/session/category';
    static PUT_UPDATE_THUMNAIL = '/api/admin/session/content/thumbnail';
    static PUT_UPDATE_BANNER = '/api/admin/session/content/banner';
    static PUT_UPDATE_VIDEO = '/api/admin/session/content/web';
    static PUT_UPDATE_TRAILER = '/api/admin/session/content/trailer';
    static PUT_S3_UPLOAD_STATUS = '/api/admin/session/content/upload/status/';

    //Search
    static GET_ALL_ADMIN_CONTENT_BY_SEARCH = '/api/admin/content/search';
    static GET_ALL_CONTENT_BY_SEARCH = '/api/content/search';

    //Episode
    static GET_ADMIN_EPISODE = '/api/admin/session/content/child';
    static POST_CREATE_EPISODE = '/api/admin/session/content/child/create';
    static PUT_EPISODE_RE_ORDER = '/api/admin/session/content';
    static GET_EPISODE = '/api/content/child';

    // Celebrity Type
    static GET_ALL_CELEBRIY_TYPE = '/api/session/celebrity-type/';
    static POST_CREATE_CELEBRIY_TYPE = '/api/admin/session/celebrity-type/create';
    static GET_CELEBRITY_TYPE = '/api/session/celebrity-type';
    static PUT_UPDATE_CELEBRIY_TYPE = '/api/admin/session/celebrity-type/update';

    // Page Meta Data
    static POST_PAGE_META_DATA = '/api/admin/session/page-metadata/create';
    static GET_ALL_PAGE_META_DATA = '/api/admin/session/page-metadata';
    static GET_PAGE_META_DATA = '/api/admin/session/page-metadata';
    static PUT_PAGE_META_DATA = '/api/admin/session/page-metadata/update';
    static DELETE_PAGE_META_DATA = '/api/admin/session/page-metadata/delete';

    //Payment 
    static PAYEMNT_GET_USER_FOR_SUBSCRIPTION = '/api/session/razor-payment/getUserInfoForSubscription';
    static PAYEMNT_GET_USER = '/api/session/razor-payment/getUserInfo/';
    static PROCESS_PAYMENT = '/api/session/razor-payment/capture';
    static PROCESS_SUBSCIPTION = '/api/session/razor-payment/validate/subscription';

    //Stripe Payment Gateway
    static STRIPE_PAYEMNT_GET_USER = '/api/session/stripe-payment/getUserInfo/';
    static STRIPE_PROCESS_PAYMENT = '/api/session/stripe-payment/capture';
    static STRIPE_PAYEMNT_GET_USER_FOR_SUBSCRIPTION = '/api/session/stripe-payment/getUserInfoForSubscription';
    static STRIPE_PROCESS_SUBSCIPTION = '/api/session/stripe-payment/validate/subscription';

    //EBS Payment Gateway
    static EBS_GENERATE_SECURE_HASH = 'api/session/ebs-payment/generateSecureHash';

    //Notifications
    static POST_EMAIL_IMAGE = 'api/admin/session/email/uploadImage';
    // static SEND_EMAIL = '/api/admin/session/send_email';
    static SEND_EMAIL = '/api/admin/session/sendEmail';  // Send bulk email from AWS SES

    //Push Notifications
    static POST_PUSH_NOTIFICATION = '/api/admin/session/pushNotification/create';
    static GET_PUSH_NOTIFICATION = '/api/admin/session/pushNotification';
    static SEND_NOTIFICATION = '/api/admin/session/send_notification';

    //Mobile App
    static POST_APP_UPDATE = '/api/admin/session/app_update/create';
    static GET_APP_UPDATES = '/api/admin/session/app_updates';
    static GET_APP_UPDATE = '/api/admin/session/app_update';
    static PUT_APP_UPDATE = '/api/admin/session/app_update/update';

    //Home Automation
    static POST_DEVICE = '/api/admin/session/iot/device/create';
    static GET_ALL_DEVICE = '/api/session/iot/devicelist';
    static GET_DEVICE = '/api/session/iot/device';
    static PUT_DEVICE = '/api/admin/session/iot/device/update';
    static REORDER_DEVICE = '/api/admin/session/iot/device/re-order';

    //Analytics
    static GET_ALL_CONTENT_USAGE_HISTORY_BY_USER = '/api/admin/session/content_usage/by_user';
    static GET_ALL_CONTENT_USAGE_HISTORY_BY_MOVIE = '/api/admin/session/content_usage/by_movie';
    static GET_CONTENT_USAGE_HISTORY_TOTAL = '/api/admin/session/content_usage/total';

    // Continue Watching
    static POST_CONTENT_TO_WATCH_HISTORY = '/api/session/user/create/content_watch_history';
    static GET_ALL_WATCH_HISTORY = '/api/session/user/content_watch_history';

    // Blogs
    static POST_BLOG = 'api/admin/session/blog/create';
    static POST_IMAGE = 'api/admin/session/blog/uploadImage';
    static GET_ALL_BLOGS = 'api/blogs';
    static GET_BLOG = 'api/session/blog';
    static PUT_BLOG = 'api/admin/session/blog/update';
    static DELETE_BLOG = 'api/admin/session/blog/delete';
    static PUT_BLOG_RE_ORDER = '/api/admin/session/blog/re-order';

    //Blog Comments
    static POST_BLOG_COMMENT ='api/session/blogComment/create';
    static GET_BLOG_COMMENT = 'api/blogComment';

    //Subscriptions
    static POST_SUBSCRIPTION = 'api/admin/session/subscription/create';
    static PUT_SUBSCRIPTION = 'api/admin/session/subscription/update';
    static GET_SUBSCRIPTION = 'api/admin/session/subscription';
    static GET_ALL_SUBSCRIPTIONS = 'api/allSubscriptions';
    static GET_ACTIVE_SUBSCRIPTIONS = 'api/subscription/SubscriptionPlan';

    //User Subscription
    static POST_USER_SUBSCRIPTION = 'api/session/subscription/userSubscription/create';
    static GET_USER_SUBSCRIPTION = 'api/session/subscription/subscribedUser';
    static GET_ALL_USER_SUBSCRIPTION = 'api/session/subscription/userSubscriptions';
    static GET_PAYMENT_DETAILS = 'api/session/payment';

    //FLEX USER
    static POST_FLEX_USER = 'api/session/flex/subscribe';
    static GET_FLEX_USER = 'api/subscription/flexUser'

    //Wallet Services
    static POST_WALLET_SERVICE_INIT = 'api/admin/session/services/operators/create';
    static GET_WALLET_SERVICES = 'api/session/services/getOperators';
    static PUT_WALLET_OPERATOR = 'api/admin/session/services/operator/update';
    static POST_WALLET_OPERATOR = 'api/admin/session/services/operator/create';
    static GET_SUBSCRIBER = 'api/admin/session/getSearchSubscriber';
    
    static POST_CHARGE_CONFIG = 'api/admin/session/charges/create';
    static GET_ALL_CHARGE_CONFIGS = 'api/session/allCharges';
    static GET_CHARGE_CONFIG = 'api/session/charges';
    static PUT_CHARGE_CONFIG = 'api/admin/session/charges/update';
    static POST_WALLET_STOCK_PURCHASE = 'api/admin/session/user/wallet/stock/create';
    static GET_WALLET_STOCKS = 'api/session/walletStocks';
    static REGISTER_MACING = 'api/session/services/registrationEncrypt';
    static GET_TRANSACTION_REPORTS = 'api/admin/session/transaction-reports';
    static GET_TRANSACTION_SUMMARY = 'api/admin/session/transaction/summary';
    static GET_ALL_TRANSACTION_HISTORY  = 'api/admin/session/transaction/history';
    static GET_ALL_TRANSACTION_REPORTS = 'api/admin/session/transactionreport/transactionType';

    static POST_THRESHOLD_ALERTS = 'api/admin/session/user/wallet/create/threshold_alerts';
    static GET_THRESHOLD_ALERTS_BY_OPERATOR = 'api/admin/session/user/wallet/threshold_alerts';
    static GET_ALL_SUBSCRIBERS = 'api/admin/session/wallet/subscribers';
    static GET_ALL_SUBSCRIBERS_BY_MONTH = 'api/admin/session/wallet/subscribersbymonth';

}


export class GlobalConstants {
    static ADMIN_USER = 'ROLE_ADMIN';
    static ROLE_SUPER_USER = 'ROLE_SUPER_USER';
}

export const FILE_UPLOAD_PROGRESS = {
    observe: 'events',
    reportProgress: true
};
