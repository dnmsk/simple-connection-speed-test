if Rack::Utils.respond_to?("key_space_limit=")
  Rack::Utils.key_space_limit = 100*1024*1024
end
