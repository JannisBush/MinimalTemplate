library(tidyverse)

setwd("where the data is")

# read the data
d = readr::read_csv('name of the datafile.csv') %>% 
  # only look at main trials
  filter(block != "practice") %>%
  # kick out all participants with less than 85% correct in the main trials
  group_by(submission_id) %>% mutate(correctnessScore = mean(ifelse(correct == 'true', 1, 0))) %>% filter(correctnessScore > 0.85) %>% ungroup() %>%
  # only look at correct trials (correct==true) and kick out catch trials (target!=false)
  filter(correct == "true" & target != "false") %>% 
  #### only for test data, changed in the experiment so not necessary (forbidden) for the the real data v
  mutate(org = as.integer(org),
         orgPrime = ifelse(org <= 1, org,org+1),
         target = as.integer(target),
         targetPrime = ifelse(target <= 1, target,target+1)) %>%
  ####^
  # get the main conditions valid_cue vs invalid_cue 
  mutate(conditionCue = factor(case_when( orgPrime == targetPrime ~ "valid_cue",
                                            TRUE ~ "invalid_cue"), ordered = T, levels = c("valid_cue", "invalid_cue"))) %>%
  # divide invalid_cue in between_object and within_object
  mutate(conditionShift = factor(case_when( orgPrime == targetPrime ~ "valid_cue",
                                         (rotate == "false" & abs(orgPrime - targetPrime) > 1) | (rotate == "true" & abs(orgPrime - targetPrime) == 1) ~ "within_object",
                                         TRUE ~ "between_object"), ordered = T, levels = c("valid_cue", "within_object", "between_object"))) %>%
  # divide invalid_cue in between_field and within_field
  mutate(conditionField = factor(case_when( orgPrime == targetPrime ~ "valid_cue",
                                            (rotate == "false" & conditionShift == "within_object") | (rotate == "true" & conditionShift == "between_object") ~ "within_field",
                                            TRUE ~ "between_field"), ordered = T, levels = c("valid_cue", "within_field", "between_field")))  #%>%

  # TODO kick out all trials faster than 3 std from mean for all 3 conditions

  # TODO kick out all trials slower than 3 std from mean for all 3 conditions
  
  # TODO other stuff?

# Summarize the RTs
dsummary = d %>% group_by(conditionCue, conditionShift, conditionField) %>% 
  summarize(meanRT = mean(RT)) %>% 
  ungroup() 
dsummary

  
# plot condition valid cue vs invalid cue
ggplot(d , aes(y = log(RT), x = conditionCue)) + geom_violin()
ggplot(d , aes(x = log(RT), color = conditionCue)) + geom_density()

# plot condition invalid cues: within_object vs between_object
ggplot(filter(d,conditionCue == "invalid_cue") , aes(y = log(RT), x = conditionShift)) + geom_violin()
ggplot(filter(d,conditionCue == "invalid_cue") , aes(x = log(RT), color = conditionShift)) + geom_density()

# plot condition invalid cues: within_field vs between_field
ggplot(filter(d,conditionCue == "invalid_cue") , aes(y = log(RT), x = conditionField)) + geom_violin()
ggplot(filter(d,conditionCue == "invalid_cue") , aes(x = log(RT), color = conditionField)) + geom_density()

# do a linear model to predict log RT valid_cue vs invalid_cue
mod = lm(log(RT) ~ conditionCue, data = d)  
summary(mod)

# do a linear model to predict log RT invalid_cue: within_object vs between_object
mod = lm(log(RT) ~ conditionShift, data = filter(d, conditionCue == "invalid_cue"))  
summary(mod)

# do a linear model to predict log RT invalid_cue: within_field vs between_field
mod = lm(log(RT) ~ conditionField, data = filter(d, conditionCue == "invalid_cue"))  
summary(mod)

# do a linear model to say that rotation does not make a difference
mod = lm(log(RT) ~ rotate, data = d)  
summary(mod)

