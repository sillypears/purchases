select
    `p`.`id` AS `id`,
    `c`.`id` AS `category_id`,
    `c`.`display_name` AS `category_name`,
    `p`.`detail` AS `detail`,
    `p`.`entity` AS `entity`,
    `p`.`entity_display` AS `sculpt`,
    `s`.`id` AS `sculpt_id`,
    `s`.`display_name` AS `sculpt_style`,
    `p`.`ka_id` AS `ka_id`,
    `m`.`display_name` AS `maker_name`,
    `m`.`id` AS `maker_id`,
    `m`.`instagram` AS `instagram`,
    `m`.`archivist_name` AS `archivist`,
    `m`.`archivist_id` AS `archivist_id`,
    `v`.`display_name` AS `vendor_name`,
    `v`.`id` AS `vendor_id`,
    `v`.`link` AS `link`,
    `p`.`price` AS `price`,
    `p`.`adjustments` AS `adjustments`,
    `p`.`price` + `p`.`adjustments` AS `total`,
    `p`.`series_num` AS `series_num`,
    `p`.`series_total` AS `series_total`,
    `st`.`id` AS `sale_id`,
    `st`.`display_name` AS `sale_type`,
    `p`.`soldDate` AS `soldDate`,
    `p`.`salePrice` AS `salePrice`,
    `p`.`isSold` AS `isSold`,
    `p`.`willSell` AS `willSell`,
    `p`.`received` AS `received`,
    `p`.`purchaseDate` AS `purchaseDate`,
    `p`.`receivedDate` AS `receivedDate`,
    `p`.`orderSet` AS `orderSet`,
    `p`.`notes` AS `notes`,
    `p`.`image` AS `image`,
    `p`.`image_250` AS `image_250`,
    `p`.`image_720` AS `image_720`,
    `p`.`ig_post` AS `ig_post`,
    `p`.`retail_price` AS `retail_price`,
    `p`.`includeInCount` AS `includeInCount`,
    `p`.`includeInPriceCount` AS `includeInPriceCount`,
    group_concat(distinct `mc`.`color` separator ',') AS `mainColors`,
    group_concat(distinct `t`.`tagname` separator ',') AS `tags`,
    `p`.`stem` AS `stem`,
    `p`.`keycap_size` AS `keycap_size`,
    `p`.`released_month` AS `released_month`,
    `p`.`released_year` AS `released_year`,
    `p`.`selfHostedImage` AS `selfHostedImage`,
    `m`.`shipping_city` AS `maker_city`,
    `m`.`shipping_state` AS `maker_state`,
    `m`.`shipping_country` AS `maker_country`,
    `p`.`tracking_info` AS `tracking_info`
from
    (
        (
            (
                (
                    (
                        (
                            (
                                `keyboard`.`purchases` `p`
                                left join `keyboard`.`categories` `c` on(`c`.`id` = `p`.`category`)
                            )
                            left join `keyboard`.`makers` `m` on(`m`.`id` = `p`.`maker`)
                        )
                        left join `keyboard`.`vendors` `v` on(`v`.`id` = `p`.`vendor`)
                    )
                    left join `keyboard`.`sale_types` `st` on(`st`.`id` = `p`.`saleType`)
                )
                left join `keyboard`.`tags` `t` on(`t`.`purchaseid` = `p`.`id`)
            )
            left join `keyboard`.`styles` `s` on(`s`.`id` = `p`.`style`)
        )
        left join `keyboard`.`main_colors` `mc` on(`mc`.`purchase_id` = `p`.`id`)
    )
group by
    `p`.`id`