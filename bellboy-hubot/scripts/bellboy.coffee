# Description:
#   Door interactions
#
# Dependencies:
#   "<module name>": "<module version>"
#
# Commands:
#   hubot open|o - opens door
#   hubot enable|disable - set door <status>
#   hubot play <sound> - play <sound>
#   hubot cam - takes a picture
#   hubot list sounds - lists sound config
#   hubot list available sounds - <lists sounds>
#   hubot set sound <sound> for <event> - set <sound> for <event
#   hubot download sound <sound> - downloads <sound>
#
# Notes:
#
# Configuration:
# BELLBOY_SILENT_ROOM
# BELLBOY_LOUD_ROOM
# BELLBOY_EXTERNAL_ADDRESS - Hostname or IP
#   
#
# Author:
#   erikzaadi
#

apiCaller = require('../../bellboy-broker')()

module.exports = (robot) ->
  loudRoom = process.env.BELLBOY_LOUD_ROOM
  silentRoom = process.env.BELLBOY_SILENT_ROOM
  externalAddress = process.env.BELLBOY_EXTERNAL_ADDRESS
  enabled = true

  openDoor = (msg) ->
    console.log "openDoor"
    return msg.reply 'Bellboy is currently disabled' if not enabled
    apiCaller.emit 'openDoor'

  robot.hear /^\s*o(p(en?)?)?/i, (msg) ->
    openDoor(msg)

  robot.respond /^\s*o(p(en?)?)?/i, (msg) ->
    openDoor(msg)

  enable = () ->
    console.log "enable"
    enabled = true
    apiCaller.emit 'enable'

  robot.hear /(^enable$|^on$)/i, (msg) ->
    enable()

  robot.respond /(^enable$|^on$)/i, (msg) ->
    enable()

  disable = () ->
    console.log "disable"
    enabled = false
    apiCaller.emit 'disable'

  robot.hear /(^disable$|^off$)/i, (msg) ->
    disable()

  robot.respond /(^disable$|^off$)/i, (msg) ->
    disable()

  robot.hear /(^cam$)/i, (msg) ->
    console.log 'cam'
    apiCaller.emit 'takeSnapshot'

  robot.respond /play (sound)/i, (msg) ->
    console.log 'play',  msg.match[1]
    apiCaller.emit "play", msg.match[1]

  robot.respond /list sounds/i, (msg) ->
    console.log 'list sounds'
    apiCaller.emit 'listConfiguredSounds'

  robot.respond /list available sounds/i, (msg) ->
    console.log 'list available sounds'
    apiCaller.emit 'listSounds'

  robot.respond /set sound (\w) for (\w)/i, (msg) ->
    sound = msg.match[1]
    evt = msg.match[2]
    console.log 'set sound', sound, 'for', evt
    apiCaller.emit 'setSoundForEvent', 
      event: evt
      sound: sound

  robot.respond /download sound (.*)$/i, (msg) ->
    soundUrl = msg.match[1]
    console.log 'download sound', soundUrl
    apiCaller.emit 'downloadSound', 
      url: soundUrl

  apiCaller.on 'doorChanged', (data) ->
    message = ""
    if data.status == 'closed'
      message = "NOT " 
    console.log "doorChanged", data.status
    robot.messageRoom loudRoom, "YOU SHALL #{message}PASS!!1"

  apiCaller.on 'buzzard', (data) ->
    for room in [loudRoom, silentRoom]
      robot.messageRoom room, "There's someone at the door!"
    apiCaller.emit 'takeSnapshot'

  apiCaller.on 'enable', () ->
    robot.messageRoom loudRoom, 'Bellboy enabled'
    enabled = true

  apiCaller.on 'disable', () ->
    robot.messageRoom loudRoom, 'Bellboy disabled'
    enabled = false

  apiCaller.on 'snapshotTaken', () ->
    console.log 'snapshotTaken'
    for room in [loudRoom, silentRoom]
      robot.messageRoom room, "http://#{externalAddress}:3000/snapshot.png?cacheBusterz=#{Math.round(Math.random() * 321321).toString()}"

  apiCaller.on 'listSoundResult', (data) ->
    for room in [loudRoom, silentRoom]
      robot.messageRoom room, "Available sounds:\n#{data.join("\n")}"

  apiCaller.on 'listConfiguredSoundResult', (data) ->
    for room in [loudRoom, silentRoom]
      robot.messageRoom room, "Configured sounds:\n#{data.join("\n")}"
