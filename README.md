# AntSim
A fun project to test some pathfinding and genetic algorithms

See for yourself at [https://cpetry.github.io/AntSim/]

## Main idea

Program your own ants, protect your queen and try to survive as long as possible!
Each iteration/step the ants have to decide what to do. Grab food, fight spiders or just find their way around.
There are two ways you can influence the outcome:

1. Programming each of the ants behavior.
2. Giving advice to the queen with whom it is best to mate and produce offspring.

### Inheritance

When enough food is gathered, the queen inside the hive can give birth to more ants. 
She has to decide who is worthy for mating and therefor which kind of genes the new offspring shall have.

#### Third party libs used (licenses)
- ACE (BSD)
- flotr2 (MIT)
- qunit (MIT)
- seedrandom (MIT)