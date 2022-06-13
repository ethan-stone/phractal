-- CreateTable
CREATE TABLE "all_auth_recipe_users" (
    "user_id" CHAR(36) NOT NULL,
    "recipe_id" STRING(128) NOT NULL,
    "time_joined" INT8 NOT NULL,

    CONSTRAINT "all_auth_recipe_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "emailpassword_pswd_reset_tokens" (
    "user_id" CHAR(36) NOT NULL,
    "token" STRING(128) NOT NULL,
    "token_expiry" INT8 NOT NULL,

    CONSTRAINT "emailpassword_pswd_reset_tokens_pkey" PRIMARY KEY ("user_id","token")
);

-- CreateTable
CREATE TABLE "emailpassword_users" (
    "user_id" CHAR(36) NOT NULL,
    "email" STRING(256) NOT NULL,
    "password_hash" STRING(128) NOT NULL,
    "time_joined" INT8 NOT NULL,

    CONSTRAINT "emailpassword_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "emailverification_tokens" (
    "user_id" STRING(128) NOT NULL,
    "email" STRING(256) NOT NULL,
    "token" STRING(128) NOT NULL,
    "token_expiry" INT8 NOT NULL,

    CONSTRAINT "emailverification_tokens_pkey" PRIMARY KEY ("user_id","email","token")
);

-- CreateTable
CREATE TABLE "emailverification_verified_emails" (
    "user_id" STRING(128) NOT NULL,
    "email" STRING(256) NOT NULL,

    CONSTRAINT "emailverification_verified_emails_pkey" PRIMARY KEY ("user_id","email")
);

-- CreateTable
CREATE TABLE "jwt_signing_keys" (
    "key_id" STRING(255) NOT NULL,
    "key_string" STRING NOT NULL,
    "algorithm" STRING(10) NOT NULL,
    "created_at" INT8,

    CONSTRAINT "jwt_signing_keys_pkey" PRIMARY KEY ("key_id")
);

-- CreateTable
CREATE TABLE "key_value" (
    "name" STRING(128) NOT NULL,
    "value" STRING,
    "created_at_time" INT8,

    CONSTRAINT "key_value_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "passwordless_codes" (
    "code_id" CHAR(36) NOT NULL,
    "device_id_hash" CHAR(44) NOT NULL,
    "link_code_hash" CHAR(44) NOT NULL,
    "created_at" INT8 NOT NULL,

    CONSTRAINT "passwordless_codes_pkey" PRIMARY KEY ("code_id")
);

-- CreateTable
CREATE TABLE "passwordless_devices" (
    "device_id_hash" CHAR(44) NOT NULL,
    "email" STRING(256),
    "phone_number" STRING(256),
    "link_code_salt" CHAR(44) NOT NULL,
    "failed_attempts" INT8 NOT NULL,

    CONSTRAINT "passwordless_devices_pkey" PRIMARY KEY ("device_id_hash")
);

-- CreateTable
CREATE TABLE "passwordless_users" (
    "user_id" CHAR(36) NOT NULL,
    "email" STRING(256),
    "phone_number" STRING(256),
    "time_joined" INT8 NOT NULL,

    CONSTRAINT "passwordless_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role" STRING(255) NOT NULL,
    "permission" STRING(255) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role","permission")
);

-- CreateTable
CREATE TABLE "roles" (
    "role" STRING(255) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "session_access_token_signing_keys" (
    "created_at_time" INT8 NOT NULL,
    "value" STRING,

    CONSTRAINT "session_access_token_signing_keys_pkey" PRIMARY KEY ("created_at_time")
);

-- CreateTable
CREATE TABLE "session_info" (
    "session_handle" STRING(255) NOT NULL,
    "user_id" STRING(128) NOT NULL,
    "refresh_token_hash_2" STRING(128) NOT NULL,
    "session_data" STRING,
    "expires_at" INT8 NOT NULL,
    "created_at_time" INT8 NOT NULL,
    "jwt_user_payload" STRING,

    CONSTRAINT "session_info_pkey" PRIMARY KEY ("session_handle")
);

-- CreateTable
CREATE TABLE "thirdparty_users" (
    "third_party_id" STRING(28) NOT NULL,
    "third_party_user_id" STRING(128) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "email" STRING(256) NOT NULL,
    "time_joined" INT8 NOT NULL,

    CONSTRAINT "thirdparty_users_pkey" PRIMARY KEY ("third_party_id","third_party_user_id")
);

-- CreateTable
CREATE TABLE "user_metadata" (
    "user_id" STRING(128) NOT NULL,
    "user_metadata" STRING NOT NULL,

    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" STRING(128) NOT NULL,
    "role" STRING(255) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role")
);

-- CreateIndex
CREATE INDEX "all_auth_recipe_users_pagination_index" ON "all_auth_recipe_users"("time_joined", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "emailpassword_pswd_reset_tokens_token_key" ON "emailpassword_pswd_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "emailpassword_password_reset_token_expiry_index" ON "emailpassword_pswd_reset_tokens"("token_expiry");

-- CreateIndex
CREATE UNIQUE INDEX "emailpassword_users_email_key" ON "emailpassword_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "emailverification_tokens_token_key" ON "emailverification_tokens"("token");

-- CreateIndex
CREATE INDEX "emailverification_tokens_index" ON "emailverification_tokens"("token_expiry");

-- CreateIndex
CREATE UNIQUE INDEX "passwordless_codes_link_code_hash_key" ON "passwordless_codes"("link_code_hash");

-- CreateIndex
CREATE INDEX "passwordless_codes_created_at_index" ON "passwordless_codes"("created_at");

-- CreateIndex
CREATE INDEX "passwordless_codes_device_id_hash_index" ON "passwordless_codes"("device_id_hash");

-- CreateIndex
CREATE INDEX "passwordless_devices_phone_number_index" ON "passwordless_devices"("phone_number");

-- CreateIndex
CREATE INDEX "passwordless_devices_email_index" ON "passwordless_devices"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passwordless_users_email_key" ON "passwordless_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passwordless_users_phone_number_key" ON "passwordless_users"("phone_number");

-- CreateIndex
CREATE INDEX "role_permissions_permission_index" ON "role_permissions"("permission");

-- CreateIndex
CREATE UNIQUE INDEX "thirdparty_users_user_id_key" ON "thirdparty_users"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_index" ON "user_roles"("role");

-- AddForeignKey
ALTER TABLE "emailpassword_pswd_reset_tokens" ADD CONSTRAINT "emailpassword_pswd_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "emailpassword_users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passwordless_codes" ADD CONSTRAINT "passwordless_codes_device_id_hash_fkey" FOREIGN KEY ("device_id_hash") REFERENCES "passwordless_devices"("device_id_hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE CASCADE ON UPDATE NO ACTION;
