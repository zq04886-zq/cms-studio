-- CreateTable
CREATE TABLE `application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `application_string` VARCHAR(256) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `component_definition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `component_key` VARCHAR(20) NOT NULL,
    `update_time` DATETIME(0) NOT NULL,

    INDEX `group_id`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `component_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `update_time` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page_id` INTEGER NOT NULL,
    `component_string` LONGTEXT NOT NULL,
    `sort` INTEGER NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    INDEX `page_id`(`page_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `application_id` INTEGER NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `cover` VARCHAR(1024) NOT NULL,
    `page_type` INTEGER NULL,
    `is_abled` INTEGER NULL,
    `page_string` LONGTEXT NOT NULL,
    `create_time` DATETIME(0) NOT NULL,
    `update_time` DATETIME(0) NOT NULL,
    `creator` VARCHAR(100) NOT NULL,
    `share_desc` VARCHAR(1024) NULL,
    `share_image` VARCHAR(1024) NULL,

    INDEX `application_id`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `url` VARCHAR(1024) NULL,
    `created_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jvCode` VARCHAR(100) NULL,
    `jvName` VARCHAR(200) NULL,
    `brand` VARCHAR(100) NULL,
    `imgUrl` VARCHAR(1024) NULL,
    `listPrice` DECIMAL(10, 2) NULL,

    UNIQUE INDEX `jvCode`(`jvCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `token_hash` VARCHAR(64) NOT NULL,
    `user_id` INTEGER NULL,
    `expires_at` DATETIME(0) NULL,

    PRIMARY KEY (`token_hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_name`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `component_definition` ADD CONSTRAINT `component_definition_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `component_group`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `components` ADD CONSTRAINT `components_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page` ADD CONSTRAINT `page_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
