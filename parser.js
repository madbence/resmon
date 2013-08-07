var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');

var SAR = function(interval, options) {
  events.EventEmitter.call(this);
  options = options || {};
  this.interval = interval || 5;
  this.parameters = options.parameters || ['-A'];
  this._buffer = '';
}

var mapping = {
  'rtps': 'io', //-b
  'pgpgin/s': 'page', //-B
  'DEV': 'block', //-d
  'kbhubfree': 'hugepage', //-H
  'INTR': 'int', //-I
  'MHz': 'power:cpu', //-m CPU
  'rpm': 'power:fan', //-m FAN
  'wghMHz': 'power:freq', //-m FREQ
  'inV': 'power:voltage', //-m IN
  'degC': 'power:temp', //-m TEMP
  'BUS': 'power:usb', //-m USB
  'rxpck/s': 'net:dev', //-n DEV
  'rxerr/s': 'net:edev', //-n EDEV
  'call/s': 'net:nfs', //-n NFS
  'scall/s': 'net:nfsd', //-n NFSD
  'totsck': 'net:sock', //-n SOCK
  'irec/s': 'net:ip', //-n IP
  'ihdrerr/s': 'net:eip', //-n EIP
  'imsg/s': 'net:icmp', //-n ICMP
  'ierr/s': 'net:eicmp', //-n EICMP
  'active/s': 'net:tcp', //-n TCP
  'atmptf/s': 'net:etcp', //-n ETCP
  'idgm/s': 'net:udp', //-n UDP
  'tcp6sck': 'net:sock6', //-n SOCK6
  'irec6/s': 'net:ip6', //-n IP6
  'ihdrer6/s': 'net:eip6', //-n EIP6
  'imsg6/s': 'net:icmp6', //-n ICMP6
  'ierr6/s': 'net:eicmp6', //-n EICMP6
  'idgm6/s': 'net:udp6', //-n UDP6
  'CPU': 'cpu', //-P or -u
  'runq-sz': 'load', //-q
  'kbmemfree': 'memory', //-r
  'frmpg/s': 'memoryPages', //-R
  'kbswpfree': 'swap', //-S
  'dentunusd': 'kernel', //-v
  'proc/s': 'task', //-w
  'pswpin/s': 'swapPages', //-W
  'rcvin/s': 'tty', //-y
};

util.inherits(SAR, events.EventEmitter);

SAR.prototype.start = function() {
  var self = this;
  this._child = spawn('sar', this.parameters.concat([this.interval]));
  this._child.stdout.on('data', function(buf) {
    try {
      self._buffer += buf.toString();
      while(self._buffer.indexOf('\n\n') !== -1) {
        var raw = self._buffer.substr(0, self._buffer.indexOf('\n\n'));
        self._buffer = self._buffer.substr(self._buffer.indexOf('\n\n')+2);
        var data = raw.split('\n').map(function(line) {
          //transform line to array of fields
          return line.split(/\s+/).filter(function(_,index) {
            // filter timestamps (first field)
            return index;
          });
        }).reduce(function(columns, line, index) {
          //change row-major order to column-major order
          return line.forEach(function(field, index) {
            (columns[index] || (columns[index] = [])) && columns[index].push(field);
          }), columns;
        }, []).reduce(function(result, column) {
          //the first value in the array is the column header
          return (result[column[0]] = column.filter(function(_,index) {
            return index;
          })), result;
        }, {});
        var found = false;
        for(var prop in mapping) {
          if(prop in data) {
            found = true;
            self.emit(mapping[prop], data);
            break;
          }
        }
        found || self.emit('UNKNOWN', data);
      }
    } catch(ex) {
      self.emit('error', ex);
    }
  });
}

module.exports = SAR;
