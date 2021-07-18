package com.stinsoft.kaftan.model;

/**
 * Created by ssu on 18/12/17.
 */
public enum CategoryType {

    CATEGORY(1),
    CELEBRITY(2),
    GENRE(3),
    HOME_FEATURED(4),
    PAYPERVIEW(5),
    CHANNEL(6),
    RADIO(7),
    HOME_CATEGORY(8);

    private final int value;

    private CategoryType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
