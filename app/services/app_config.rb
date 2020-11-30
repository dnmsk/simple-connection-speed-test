class AppConfig
  def [](key)
    @app_config ||= YAML.load_file(Rails.root.join('config', 'application.yml'))[Rails.env].deep_symbolize_keys
    @app_config[key]
  end
end
