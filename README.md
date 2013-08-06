# Resmon

Simple wrapper around `sar(1)`, using `EventEmitter`.

### Install

    npm install resmon

### Usage

```js
var SAR = require('resmon');
var daemon = new SAR();
daemon.on('cpu', function(stat) {
  /* ... */
});
daemon.start();
```

### Events

For details, see `man sar`.

SAR instance emits objects, the keys are field names, the values are arrays, eg. if you have multiple CPU cores:

```js
var SAR = require('resmon');
var daemon = new SAR();
daemon.on('cpu', function(stat) {
  console.log(stat['%usr'][0]);
  //display CPU utilization percentage (at user level) for all CPUs
  //usually the first row contains aggregated (sum, avg, etc.) values
});
```

#### cpu
Fields: `CPU`, `%usr`, `%nice`, `%sys`, `%iowait`, `%steal`, `%irq`, `%soft`, `%guest`, `%idle`

#### task
Fields: `proc/s`, `cswch/s`

#### int
Fields: `INTR`, `intr/s`

#### swapPages
Fields: `pswpin/s`, `pswpout/s`

#### page
Fields: `pgpgin/s`, `pgpgout/s`, `fault/s`, `majflt/s`, `pgfree/s`, `pgscank/s`, `pgscand/s`, `pgsteal/s`, `%vmeff`

#### io
Fields: `tps`, `rtps`, `wtps`, `bread/s`, `bwrtn/s`

#### memoryPages
Fields: `frmpg/s`, `bufpg/s`, `campg/s`

#### memory
Fields: `kbmemfree`, `kbmemused`, `%memused`, `kbbuffers`, `kbcached`, `kbcommit`, `%commit`, `kbactive`, `kbinact`

#### swap
Fields: `kbswpfree`, `kbswpused`, `%swpused`, `kbswpcad`, `%swpcad`

#### kernel
Fields: `dentunusd`, `file-nr`, `inode-nr`, `pty-nr`

#### load
Fields: `runq-sz`, `plist-sz`, `ldavg-1`, `ldavg-5`, `ldavg-15`, `blocked`

#### block
Fields: `DEV`, `tps`, `rd_sec/s`, `wr_sec/s`, `avgrq-sz`, `avgqu-sz`, `await`, `svctm`, `%util`

#### net:dev
Fields: `IFACE`, `rxpck/s`, `txpck/s`, `rxkB/s`, `txkB/s`, `rxcmp/s`, `txcmp/s`, `rxmcst/s`

#### net:edev
Fields: `IFACE`, `rxerr/s`, `txerr/s`, `coll/s`, `rxdrop/s`, `txdrop/s`, `txcarr/s`, `rxfram/s`, `rxfifo/s`, `txfifo/s`

#### net:nfs
Fields: `call/s`, `retrans/s`, `read/s`, `write/s`, `access/s`, `getatt/s`

#### net:nfsd
Fields: `scall/s`, `badcall/s`, `packet/s`, `udp/s`, `tcp/s`, `hit/s`, `miss/s`, `sread/s`, `swrite/s`, `saccess/s`, `sgetatt/s`

#### net:sock
Fields: `totsck`, `tcpsck`, `udpsck`, `rawsck`, `ip-frag`, `tcp-tw`

#### net:ip
Fields: `irec/s`, `fwddgm/s`, `idel/s`, `orq/s`, `asmrq/s`, `asmok/s`, `fragok/s`, `fragcrt/s`

#### net:eip
Fields: `ihdrerr/s`, `iadrerr/s`, `iukwnpr/s`, `idisc/s`, `odisc/s`, `onort/s`, `asmf/s`, `fragf/s`

#### net:icmp
Fields: `imsg/s`, `omsg/s`, `iech/s`, `iechr/s`, `oech/s`, `oechr/s`, `itm/s`, `itmr/s`, `otm/s`, `otmr/s`, `iadrmk/s`, `iadrmkr/s`, `oadrmk/s`, `oadrmkr/s`

#### net:eicmp
Fields: `ierr/s`, `oerr/s`, `idstunr/s`, `odstunr/s`, `itmex/s`, `otmex/s`, `iparmpb/s`, `oparmpb/s`, `isrcq/s`, `osrcq/s`, `iredir/s`, `oredir/s`

#### net:tcp
Fields: `active/s`, `passive/s`, `iseg/s`, `oseg/s`

#### net:etcp
Fields: `atmptf/s`, `estres/s`, `retrans/s`, `isegerr/s`, `orsts/s`

#### net:udp
Fields: `idgm/s`, `odgm/s`, `noport/s`, `idgmerr/s`

#### net:sock6
Fields: `tcp6sck`, `udp6sck`, `raw6sck`, `ip6-frag`

#### net:ip6
Fields: `irec6/s`, `fwddgm6/s`, `idel6/s`, `orq6/s`, `asmrq6/s`, `asmok6/s`, `imcpck6/s`, `omcpck6/s`, `fragok6/s`, `fragcr6/s`

#### net:eip6
Fields: `ihdrer6/s`, `iadrer6/s`, `iukwnp6/s`, `i2big6/s`, `idisc6/s`, `odisc6/s`, `inort6/s`, `onort6/s`, `asmf6/s`, `fragf6/s`, `itrpck6/s`

#### net:icmp6
Fields: `imsg6/s`, `omsg6/s`, `iech6/s`, `iechr6/s`, `oechr6/s`, `igmbq6/s`, `igmbr6/s`, `ogmbr6/s`, `igmbrd6/s`, `ogmbrd6/s`, `irtsol6/s`, `ortsol6/s`, `irtad6/s`, `inbsol6/s`, `onbsol6/s`, `inbad6/s`, `onbad6/s`

#### net:eicmp6
Fields: `ierr6/s`, `idtunr6/s`, `odtunr6/s`, `itmex6/s`, `otmex6/s`, `iprmpb6/s`, `oprmpb6/s`, `iredir6/s`, `oredir6/s`, `ipck2b6/s`, `opck2b6/s`

#### net:udp6
Fields: `idgm6/s`, `odgm6/s`, `noport6/s`, `idgmer6/s`

#### power:cpu
Fields: `CPU`, `MHz`

#### power:temp
Fields: `TEMP`, `degC`, `%temp`, `DEVICE`

#### power:freq
Fields: `CPU`, `wghMHz`

#### UNKNOWN
If `sar` output can be parsed, but the mapping for the event is missing, `UNKNOWN` event is emitted, with the parsed object.

#### error
If `sar` output cannot be parsed, `error` is emitted with the details
