require_relative 'boot'

require "rails"

#require "active_record/railtie"
#require "active_storage/engine"
require "action_controller/railtie"
require "action_view/railtie"
#require "action_mailer/railtie"
#require "active_job/railtie"
#require "action_cable/engine"
#require "action_mailbox/engine"
#require "action_text/engine"
#require "rails/test_unit/railtie"
#require "sprockets/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SimpleConnectionSpeedTestRails
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.middleware.delete ActionDispatch::Session::CookieStore

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**/*.{rb,yml}').to_s]
    config.i18n.default_locale = :en
    I18n.eager_load!
  end
end
