set :stage, :production
set :deploy_to, "/home/apps/#{fetch :application}/#{fetch :stage}"
set :branch, -> do
  'master'
end

hosts = [
  #'192.168.0.112'
  #'192.168.0.100'
  'dnmsk.ru'
]

hosts.each do |host|
  server host, user: fetch(:application), roles: %w(web app db), port: 1022
  set :branch, -> do
    `git rev-parse --abbrev-ref master`.chomp
  end

  #append :linked_files, '.env.production'
end
