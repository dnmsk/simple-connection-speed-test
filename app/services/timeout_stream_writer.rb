class TimeoutStreamWriter
  BLOCK_SIZE = (10 * 1024).freeze

  def initialize(stream, timeout:, block_size:, max_bytes:)
    @stream= stream
    @timeout = avg(5, timeout, 20)
    @block_size = avg(1024, block_size, BLOCK_SIZE * 10)
    @max_bytes = avg(@block_size, max_bytes, @block_size * 1024)
  end

  def call
    begin
      Timeout::timeout(@timeout) do
        curr_sended = 0
        loop do
          curr_sended += @block_size
          @stream.write(rnd_sequence(@block_size))
          break if curr_sended >= @max_bytes
        end
      end
    rescue => e
    end
  end

  private

  def avg(min, val, max)
    [[min, val].max, max].min
  end

  def rnd_sequence(length)
    Random.urandom(length)
  end
end
